import useLocaleStore, { type Locale } from "../../store/useLanguageStore";
import Header from "../Header/Header";

function Home() {
  const { locale } = useLocaleStore() as {locale: Locale};

  return (<>
    <Header/>
    <div style={{fontSize: 25}}>
      {locale["home"]["greetings"]}
    </div>
  </>)
}

export default Home;
