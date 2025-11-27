import Header from "../Header/Header";
import useLanguageStore, { type Locale } from "../../store/useLanguageStore";
import styles from "./Home.module.css";
import { data } from "../../static";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import getShortDescription from "../../utils/getShortDescription";

interface Skill {
  title: string;
  description: string[];
  skills: string[];
}

interface Project {
  id: string;
  title: string;
  description: string[];
  datetime: string;
  tags: string[];
  images: string[];
}

function SkillCard({ title, description, skills }: Skill) {
  return (
    <article className={styles.skillCard}>
      <div className={styles.skillAccent} />
      <h3>{title}</h3>
      {description.map((item, index) => (
        <p key={`${title}-description-${index}`}>{item}</p>
      ))}
      <ul>
        {skills.map((skill) => (
          <li key={skill}>
            <img src={data.icons[skill].icon} className="noselect"/>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Home() {
  const { locale } = useLanguageStore() as { locale: Locale | null };
  const navigator = useNavigate();
  const projects = useMemo(
    () => ((locale?.projectsList ?? []) as Project[]),
    [locale?.projectsList]
  );

  const latestProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (first, second) =>
            new Date(second.datetime).getTime() - new Date(first.datetime).getTime()
        )
        .slice(0, 3),
    [projects]
  );

  return (
    <>
      <Header />
      <main className={styles.home}>
        <section className={styles.hero}>
          <p className={styles.greeting}>{locale?.home.mainCard.greetings}</p>
          <h1 className={styles.heroName}>
            <span>{locale?.home.mainCard.firstname}</span>{" "}
            <span className={styles.lastName}>{locale?.home.mainCard.lastname}</span>
          </h1>
          <p className={styles.heroDescription}>{locale?.home.mainCard.description}</p>
          <p className={styles.heroCaption}>{locale?.home.mainCard.addition}</p>
          <div className={styles.heroHighlights}>
            {locale?.home.mainCard.skills.map((skill: string) => (
              <div
                key={skill}
                style={data.icons[skill].bgColor ? {background: data.icons[skill].bgColor} : {}}
                className={data.icons[skill].bgColor ? styles.heroHighlightSpecial : styles.heroHighlightOrdinary}
              >
                {data.icons[skill].icon &&
                  <img src={data.icons[skill].icon} className="noselect"/>
                }
                <span>
                  {skill}
                </span>
              </div>
            ))}
          </div>
          <a className={styles.heroMainButton} onClick={() => navigator('/projects')}>
            <img src={"icons/rocket.svg"}/>
            <p>{locale?.home.mainCard.toProjectsButton}</p>
          </a>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>{locale?.home.skillsCard.subtitle}</p>
            <h2>{locale?.home.skillsCard.title}</h2>
          </div>
          <div className={styles.skillsGrid}>
            {locale?.home.skillsCard.cards.map((card: Skill) => (
              <SkillCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className={styles.section} style={{marginBottom: 100}}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>{locale?.home.projectsCard.subtitle}</p>
            <h2>{locale?.home.projectsCard.title}</h2>
          </div>
          {latestProjects.length > 0 && (
            <>
              <div className={styles.projectsPreviewGrid}>
                {latestProjects.map((project) => (
                  <article
                    key={project.id}
                    className={`transition_fix ${styles.projectPreviewCard}`}
                    onClick={() => navigator(`/project/${project.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigator(`/project/${project.id}`);
                      }
                    }}
                  >
                    <div className={styles.projectPreviewContent}>
                      <div className={styles.projectPreviewMedia}>
                        {project.images.length > 0 ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.projectPreviewFallback} />
                        )}
                      </div>
                      <p className={styles.projectPreviewDate}>
                        {new Date(project.datetime).toLocaleDateString(locale?.locale, {
                          year: "numeric",
                          month: "short"
                        })}
                      </p>
                      <h3 className={styles.projectPreviewTitle}>{project.title}</h3>
                      <p className={styles.projectPreviewDescription}>
                        {getShortDescription(project.description, 180).join(" ")}
                      </p>
                    </div>
                    <ul className={styles.projectPreviewTags}>
                      {project.tags.slice(0, 3).map((tag) => {
                        const icon = data.icons[tag]?.icon;
                        return (
                          <li key={`${project.id}-${tag}`} className="noselect">
                            {icon && <img src={icon} alt={tag} />}
                            <span>{tag}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                ))}
              </div>
              <button
                className={`transition_fix ${styles.moreButton}`}
                onClick={() => navigator("/projects")}
              >
                {locale?.home.projectsCard.moreButton ?? "More..."}
              </button>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;
