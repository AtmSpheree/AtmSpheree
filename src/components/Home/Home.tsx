import Header from "../Header/Header";
import useLanguageStore, { type Locale } from "../../store/useLanguageStore";
import styles from "./Home.module.css";
import { data } from "../../static";
import { useNavigate } from "react-router";

interface Skill {
  title: string;
  description: string[];
  skills: string[];
}

function SkillCard({ title, description, skills }: Skill) {
  return (
    <article className={styles.skillCard}>
      <div className={styles.skillAccent} />
      <h3>{title}</h3>
      {description.map((item) => (
        <p>{item}</p>
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

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>{locale?.home.projectsCard.subtitle}</p>
            <h2>{locale?.home.projectsCard.title}</h2>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
