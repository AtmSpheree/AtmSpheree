import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { data } from "../../static";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiX,
} from "react-icons/fi";
import Header from "../Header/Header";
import styles from "./Project.module.css";
import useLanguageStore, { type Locale } from "../../store/useLanguageStore";

interface ProjectData {
  id: string;
  title: string;
  description: string[];
  datetime: string;
  tags: string[];
  images: string[];
  url: string;
}

function Project() {
  const { locale } = useLanguageStore() as {
    locale: Locale | null;
  };
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const projects = useMemo(
    () => (locale?.projectsList ?? []) as ProjectData[],
    [locale]
  );

  const project = useMemo(() => {
    if (!id) {
      return null;
    }
    return projects.find(
      (projectItem) => projectItem.id.toLowerCase() === id.toLowerCase()
    );
  }, [id, projects]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exitingImage, setExitingImage] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setExitingImage(null);
    setIsAnimating(false);
    setIsViewerOpen(false);
  }, [project?.title]);

  if (!locale) {
    return null;
  }

  const handleBack = () => {
    navigate("/projects");
  };

  if (!project) {
    return (
      <>
        <Header />
        <main className={styles.projectPage}>
          <section className={styles.notFound}>
            <p>{locale?.projects.emptyState}</p>
            <button type="button" className={`transition_fix ${styles.backButton} noselect`} onClick={handleBack}>
              <FiArrowLeft />
              <span>{locale.projects?.title}</span>
            </button>
          </section>
        </main>
      </>
    );
  }

  const hasImages = project.images.length > 0;
  const hasMultipleImages = project.images.length > 1;
  const activeImage = hasImages ? project.images[activeImageIndex] : null;
  const formattedDate = new Date(project.datetime).toLocaleDateString(
    locale.locale,
    { year: "numeric", month: "long" }
  );
  const imageToggleLabel =
    locale?.projects?.cards?.imageToggleLabel ?? "Show next project image";
  const previousImageLabel =
    locale?.projects?.cards?.previousImageLabel ?? "Show previous project image";
  const openImageLabel =
    locale?.projects?.cards?.openImageLabel ?? "Open image in full screen";
  const closeViewerLabel =
    locale?.projects?.cards?.closeImageLabel ?? "Close image viewer";
  const fullScreenLabel =
    locale?.projects?.cards?.fullScreenLabel ?? "Project image full screen view";

  const advanceImage = () => {
    if (!hasMultipleImages || isAnimating) {
      return;
    }
    const currentImage = project.images[activeImageIndex];
    setExitingImage(currentImage);
    setIsAnimating(true);
    setActiveImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const goToPreviousImage = () => {
    if (!hasMultipleImages || isAnimating) {
      return;
    }
    const currentImage = project.images[activeImageIndex];
    setExitingImage(currentImage);
    setIsAnimating(true);
    setActiveImageIndex(
      (prev) => (prev - 1 + project.images.length) % project.images.length
    );
  };

  const selectImage = (index: number) => {
    if (index === activeImageIndex || isAnimating) {
      return;
    }
    setExitingImage(project.images[activeImageIndex]);
    setIsAnimating(true);
    setActiveImageIndex(index);
  };

  const openViewer = () => {
    if (!activeImage) {
      return;
    }
    setIsViewerOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openViewer();
    }
  };

  useEffect(() => {
    if (!isViewerOpen) {
      return;
    }
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsViewerOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isViewerOpen]);

  return (
    <>
      <Header />
      <main className={styles.projectPage}>
        <section className={styles.hero}>
          <button type="button" className={`transition_fix ${styles.backButton}`} onClick={handleBack}>
            <FiArrowLeft />
            <span>{locale?.project.backToProjects}</span>
          </button>
          <h1>{project.title}</h1>
          <div className={styles.heroMeta}>
            <span>{formattedDate}</span>
            <span aria-hidden="true">•</span>
            <span>{project.tags.slice(0, 3).join(" • ")}</span>
          </div>
        </section>

        <section className={styles.layout}>
          <div className={styles.gallery}>
            <div
              className={`${styles.galleryMain} ${
                activeImage ? styles.galleryMainInteractive : ""
              }`}
              onClick={activeImage ? openViewer : undefined}
              role={activeImage ? "button" : undefined}
              tabIndex={activeImage ? 0 : undefined}
              onKeyDown={activeImage ? handleKeyDown : undefined}
              aria-label={activeImage ? openImageLabel : undefined}
            >
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    className={`transition_fix ${styles.cornerArrow} ${styles.cornerArrowLeft}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToPreviousImage();
                    }}
                    aria-label={previousImageLabel}
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    type="button"
                    className={`transition_fix ${styles.cornerArrow} ${styles.cornerArrowRight}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      advanceImage();
                    }}
                    aria-label={imageToggleLabel}
                  >
                    <FiChevronRight />
                  </button>
                </>
              )}
              {activeImage && (
                <img
                  src={activeImage}
                  alt={project.title}
                  className={`${styles.galleryImage} ${styles.galleryImageActive}`}
                />
              )}
              {exitingImage && (
                <motion.img
                  key={`${project.title}-exiting`}
                  src={exitingImage}
                  alt=""
                  aria-hidden={true}
                  className={`${styles.galleryImage} ${styles.galleryImageExiting}`}
                  initial={{ opacity: 1, scale: 1, y: 0 }}
                  animate={{ opacity: 0, scale: 0.97, y: -25 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onAnimationComplete={() => {
                    setExitingImage(null);
                    setIsAnimating(false);
                  }}
                />
              )}
              {hasMultipleImages && (
                <span className={styles.imageStepper} aria-hidden={true}>
                  {activeImageIndex + 1} / {project.images.length}
                </span>
              )}
            </div>
            {hasMultipleImages && (
              <div className={styles.thumbnailRow}>
                {project.images.map((image, index) => (
                  <button
                    key={`${project.title}-${index}`}
                    type="button"
                    className={`transition_fix ${styles.thumbnail} ${
                      index === activeImageIndex ? styles.thumbnailActive : ""
                    }`}
                    onClick={() => selectImage(index)}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img src={image} alt="" aria-hidden={true} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.details}>
            <div>
              <p className={styles.sectionLabel}>{locale?.project.summaryTitle}</p>
              {project.description.map(item =>
                <p className={styles.description}>{item}</p>
              )}
            </div>

            <div className={styles.metaGrid}>
              <div>
                <p className={styles.sectionLabel}>{locale?.project.dateTitle}</p>
                <p className={styles.metaValue}>{formattedDate}</p>
              </div>
              <div>
                <p className={styles.sectionLabel}>{locale?.project.stackTitle}</p>
                <ul className={styles.tagsList}>
                  {project.tags.map((tag) => (
                    <li
                      className="noselect"
                      key={`${project.title}-${tag}`}
                      style={data.icons[tag].bgColor ?
                        {
                          background: data.icons[tag].bgColor
                        }
                      : 
                        {
                          border: "1px solid var(--surface-border-color)"
                        }
                      }
                    >
                      {data.icons[tag].icon &&
                        <img 
                          src={data.icons[tag].icon}
                          className="noselect"
                          style={data.icons[tag].bgColor ?
                            {
                              filter: "invert(100%) sepia(100%) saturate(38%) hue-rotate(254deg) brightness(110%) contrast(110%)"
                            }
                          : 
                            {}
                          }
                        />
                      }
                      <span
                        style={data.icons[tag].bgColor ?
                          {
                            color: "white"
                          }
                        : 
                          {}
                        }
                      >
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {project.url &&
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className={`transition_fix ${styles.ctaButton} noselect`}
              >
                <FiExternalLink />
                <span>{locale?.project.viewButton}</span>
              </a>
            }
          </div>
        </section>
      </main>
      {isViewerOpen && activeImage && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal={true}
          aria-label={fullScreenLabel}
          onClick={() => setIsViewerOpen(false)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setIsViewerOpen(false)}
              aria-label={closeViewerLabel}
            >
              <FiX />
            </button>
            <img
              src={activeImage}
              alt={project.title}
              className={styles.lightboxImage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Project;
