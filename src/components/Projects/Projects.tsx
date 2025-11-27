import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiCheck, FiSearch } from "react-icons/fi";
import Header from "../Header/Header";
import styles from "./Projects.module.css";
import { data } from "../../static";
import useLanguageStore, { type Locale } from "../../store/useLanguageStore";
import { useNavigate, useSearchParams } from "react-router";
import getShortDescription from "../../utils/getShortDescription";

interface Project {
  id: number;
  title: string;
  description: string[];
  datetime: string;
  tags: string[];
  images: string[];
  url: string;
}

type DropdownType = "tags" | "date" | "sort" | null;
type SortOrder = "desc" | "asc";

const dropdownMotion = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.98 }
};

interface ProjectCardProps {
  project: Project;
  locale: Locale;
}

function Projects() {
  const { locale } = useLanguageStore() as {
    locale: Locale;
  };
  const projects = (locale?.projectsList ?? []) as Project[];

  const [searchParams, setSearchParams] = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const uniqueTags = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
    [projects]
  );

  const availableYears = useMemo(
    () =>
      Array.from(
        new Set(
          projects.map((project) =>
            new Date(project.datetime).getFullYear().toString()
          )
        )
      ).sort((a, b) => Number(b) - Number(a)),
    [projects]
  );

  const selectedTags = useMemo<string[]>(() => {
    const tagsParam = searchParams.get("tags");
    if (!tagsParam) {
      return [];
    }
    return tagsParam.split(",").filter(Boolean);
  }, [searchParams]);

  const selectedYear = useMemo<string | null>(() => {
    const yearParam = searchParams.get("year");
    return yearParam && yearParam.length > 0 ? yearParam : null;
  }, [searchParams]);

  const sortOrder = useMemo<SortOrder>(() => {
    const sortParam = searchParams.get("sort");
    return sortParam === "asc" ? "asc" : "desc";
  }, [searchParams]);

  const searchTerm = useMemo(() => searchParams.get("q") ?? "", [searchParams]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const matchesSearch =
        !normalizedQuery ||
        project.title.toLowerCase().includes(normalizedQuery);
      const matchesYear =
        !selectedYear ||
        new Date(project.datetime).getFullYear().toString() === selectedYear;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => project.tags.includes(tag));
      return matchesSearch && matchesYear && matchesTags;
    });

    const sorted = filtered.sort((a, b) => {
      const diff =
        new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
      return sortOrder === "desc" ? diff : -diff;
    });

    return sorted;
  }, [projects, selectedTags, selectedYear, searchTerm, sortOrder]);

  const filtersAreActive =
    selectedTags.length > 0 ||
    Boolean(selectedYear) ||
    Boolean(searchTerm.trim()) ||
    sortOrder !== "desc";

  const filterPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (
        !filterPanelRef.current ||
        filterPanelRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setOpenDropdown(null);
    };

    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    let hasChanges = false;

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.length > 0) {
        if (params.get(key) !== value) {
          params.set(key, value);
          hasChanges = true;
        }
      } else if (params.has(key)) {
        params.delete(key);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setSearchParams(params, { replace: true });
    }
  };

  const toggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((item) => item !== tag)
      : [...selectedTags, tag];

    updateQuery({ tags: nextTags.length > 0 ? nextTags.join(",") : null });
  };

  const toggleDropdown = (type: DropdownType) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleYearSelect = (year: string) => {
    const nextYear = selectedYear === year ? null : year;
    updateQuery({ year: nextYear });
    setOpenDropdown(null);
  };

  const handleSortSelect = (order: SortOrder) => {
    updateQuery({ sort: order === "desc" ? null : order });
    setOpenDropdown(null);
  };

  const handleSearchChange = (value: string) => {
    const trimmedValue = value.trim();
    updateQuery({ q: trimmedValue.length > 0 ? value : null });
  };

  const clearFilters = () => {
    updateQuery({ tags: null, year: null, sort: null, q: null });
    setOpenDropdown(null);
  };

  return (
    <>
      <Header />
      <main className={styles.projectsPage}>
        <section className={styles.hero}>
          <p className={styles.heroLabel}>{locale.projects.title}</p>
          <h1>{locale.projects.description}</h1>
        </section>

        <section className={styles.filtersSection} ref={filterPanelRef}>
          <div className={styles.filtersGroup}>
            <div className={styles.filterControl}>
              <button
                className={`transition_fix ${styles.filterButton} ${
                  openDropdown === "tags" || selectedTags.length
                    ? styles.filterButtonActive
                    : ""
                }`}
                onClick={() => toggleDropdown("tags")}
              >
                <span>{locale.projects.filters.tagsLabel}</span>
                <div className={styles.filterState}>
                  {selectedTags.length > 0 && (
                    <span className={styles.counter}>{selectedTags.length}</span>
                  )}
                  <FiChevronDown />
                </div>
              </button>
              <AnimatePresence>
                {openDropdown === "tags" && (
                  <motion.div
                    className={styles.dropdown}
                    {...dropdownMotion}
                    transition={{ duration: 0.15 }}
                  >
                    <p className={styles.dropdownLabel}>
                      {locale.projects.filters.tagsLabel}
                    </p>
                    <div className={styles.dropdownList}>
                      {uniqueTags.map((tag) => {
                        const icon = data.icons[tag]?.icon;
                        return (
                          <button
                            key={tag}
                            className={selectedTags.includes(tag)
                              ? styles.dropdownOptionActive
                              : styles.dropdownOption
                            }
                            onClick={() => toggleTag(tag)}
                          >
                            <div className={styles.optionMeta}>
                              {icon ? (
                                <span className={styles.optionIconWrapper}>
                                  <img src={icon} alt={tag} />
                                </span>
                              ) : (
                                <span className={styles.optionFallback} />
                              )}
                              <span>{tag}</span>
                            </div>
                            {selectedTags.includes(tag) && (
                              <FiCheck className={styles.checkIcon} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.filterControl}>
              <button
                className={`transition_fix ${styles.filterButton} ${
                  openDropdown === "sort" || sortOrder !== "desc"
                    ? styles.filterButtonActive
                    : ""
                }`}
                onClick={() => toggleDropdown("sort")}
              >
                <div className={styles.filterState}>
                  <span className={styles.filterValue}>
                    {sortOrder === "desc"
                      ? locale.projects.filters.sortNewFirst
                      : locale.projects.filters.sortOldFirst}
                  </span>
                  <FiChevronDown />
                </div>
              </button>
              <AnimatePresence>
                {openDropdown === "sort" && (
                  <motion.div
                    className={`${styles.dropdown} ${styles.dropdownNarrow}`}
                    {...dropdownMotion}
                    transition={{ duration: 0.15 }}
                  >
                    <p className={styles.dropdownLabel}>
                      {locale.projects.filters.sortLabel}
                    </p>
                    <div className={styles.dropdownList}>
                      {(["desc", "asc"] as SortOrder[]).map((order) => {
                        const label =
                          order === "desc"
                            ? locale.projects.filters.sortNewFirst
                            : locale.projects.filters.sortOldFirst;
                        const isActive = sortOrder === order;
                        return (
                          <button
                            key={order}
                            className={isActive
                              ? styles.dropdownOptionActive
                              : styles.dropdownOption
                            }
                            onClick={() => handleSortSelect(order)}
                          >
                            <span>{label}</span>
                            {isActive && (
                              <FiCheck className={styles.checkIcon} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.filterControl}>
              <button
                className={`transition_fix ${styles.filterButton} ${
                  openDropdown === "date" || selectedYear
                    ? styles.filterButtonActive
                    : ""
                }`}
                onClick={() => toggleDropdown("date")}
              >
                <span>{locale.projects.filters.dateLabel}</span>
                <div className={styles.filterState}>
                  {selectedYear && (
                    <span className={styles.counter}>{selectedYear}</span>
                  )}
                  <FiChevronDown />
                </div>
              </button>
              <AnimatePresence>
                {openDropdown === "date" && (
                  <motion.div
                    className={`${styles.dropdown} ${styles.dropdownNarrow}`}
                    {...dropdownMotion}
                    transition={{ duration: 0.15 }}
                  >
                    <p className={styles.dropdownLabel}>
                      {locale.projects.filters.dateLabel}
                    </p>
                    <div className={styles.dropdownList}>
                      {availableYears.map((year) => (
                        <button
                          key={year}
                          className={selectedYear === year
                            ? styles.dropdownOptionActive
                            : styles.dropdownOption
                          }
                          onClick={() => handleYearSelect(year)}
                        >
                          <span>{year}</span>
                          {selectedYear === year && (
                            <FiCheck className={styles.checkIcon} />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className={`transition_fix ${styles.searchWrapper} ${
              isSearchFocused || searchTerm.trim()
                ? styles.searchWrapperActive
                : ""
            }`}
          >
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={locale.projects.filters.searchLabel}
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {filtersAreActive && (
            <button className={`transition_fix ${styles.clearButton}`} onClick={clearFilters}>
              {locale.projects.filters.clear}
            </button>
          )}
        </section>

        {filteredProjects.length === 0 &&
          <div className={styles.emptyState}>
            <p>{locale.projects.emptyState}</p>
          </div>
        }
        {filteredProjects.length !== 0 &&
          <section className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </section>
        }
      </main>
    </>
  );
}

function ProjectCard({ project, locale }: ProjectCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasImages = project.images.length > 0;
  const navigator = useNavigate();
  const hasMultipleImages = project.images.length > 1;
  const [isAnimating, setIsAnimating] = useState(false);
  const [exitingImage, setExitingImage] = useState<string | null>(null);
  const imageToggleLabel =
    locale?.projects?.cards?.imageToggleLabel ?? "Show next project image";

  const handleImageAdvance = () => {
    if (!hasMultipleImages || isAnimating) {
      return;
    }
    const currentImage = project.images[activeImageIndex];
    setExitingImage(currentImage);
    setIsAnimating(true);
    setActiveImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleImageAdvance();
    }
  };

  const activeImage = hasImages ? project.images[activeImageIndex] : null;

  return (
    <article className={styles.projectCard}>
      <div className={styles.cardAdditionalContainer}>
        <div
          className={`${styles.cardVisuals} ${hasMultipleImages ? styles.cardVisualsInteractive : ""}`}
          onClick={hasMultipleImages ? handleImageAdvance : undefined}
          role={hasMultipleImages ? "button" : undefined}
          tabIndex={hasMultipleImages ? 0 : undefined}
          onKeyDown={hasMultipleImages ? handleKeyDown : undefined}
          aria-label={hasMultipleImages ? imageToggleLabel : undefined}
        >
          {activeImage && (
            <img
              src={activeImage}
              alt={project.title}
              className={`${styles.cardImage} ${styles.cardImageActive}`}
            />
          )}
          {exitingImage && (
            <motion.img
              key={`${project.title}-exiting`}
              src={exitingImage}
              alt=""
              aria-hidden={true}
              className={`${styles.cardImage} ${styles.cardImageExiting}`}
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
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <p className={styles.cardDate}>
              {new Date(project.datetime).toLocaleDateString(locale?.locale, {
                year: "numeric",
                month: "short"
              })}
            </p>
            <a
              onClick={() => navigator(`/project/${project.id}`)}
              className={`transition_fix ${styles.viewButton}`}
              rel="noreferrer"
            >
              {locale?.projects.viewButton}
            </a>
          </div>
          <h3 style={{margin: 0}}>{project.title}</h3>
          <p className={styles.cardDescription}>{getShortDescription(project.description, 200).join(" ")}</p>
        </div>
      </div>
      <ul className={styles.cardTags}>
        {project.tags.map((tag) => (
          <li className="noselect" key={`${project.id}-${tag}`}>
            {data.icons[tag].icon &&
              <img src={data.icons[tag].icon} className="noselect"/>
            }
            <span>
              {tag}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default Projects;
