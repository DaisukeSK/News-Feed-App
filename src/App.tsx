import { useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./CSS/App.css";
import "./CSS/HeadLine.css";
import "./CSS/ArticleList.css";
import HeadLine from "./Pages/HeadLine/HeadLine.tsx";
import ArticleList from "./Pages/ArticleList.tsx";
import Header from "./Pages/Header.tsx";
import Unavailable from "./Pages/Unavailable.tsx";
// import dummyJson from '../ignore/dummy.json'

export type NewsArticleType = {
  content: string;
  description: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
  title: string;
  url: string;
};

type contextType = {
  news: Array<NewsArticleType>;
  showSearchBar: boolean;
  setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
  getNews: (n: number, s: string) => void;
  titleCount: (d: string, count: number) => string;
};

export const context = createContext<contextType>({} as contextType);

function App() {
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [unavailable, setUnavailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [news, setNews] = useState<Array<NewsArticleType>>([]);

  const apikey = [
    import.meta.env.VITE_APIkey_1,
    import.meta.env.VITE_APIkey_2,
    import.meta.env.VITE_APIkey_3,
  ];

  const titleCount = (title: string, count: number): string => {
    if (title.length! > count) {
      const array: Array<string> = title.split("");
      array.splice(count);

      while (array[array.length - 1] !== " ") {
        array.pop();
      }

      array.pop();
      array.push("...");

      return array.join("");
    } else {
      return title;
    }
  };

  const dummy: boolean = false;

  axios
    .get(
      "https://gnews.io/api/v4/top-headlines?lang=en&category=business&apikey=5ff8585f9ec438acfacef3cea3ba6587"
    )
    .then(function (response) {
      console.log("res", response);
    });

  const getNews = (n: number, s: string): void => {
    setLoading(true);
    setUnavailable(false);
    setNews([]);

    if (dummy) {
      setLoading(false);
      // setNews([...dummyJson.data,...dummyJson.data,...dummyJson.data])
    } else {
      let url1: string = "";
      let url2: string = "";
      let url3: string = "";

      const category1 = "business";
      const category2 = "entertainment";
      const category3 = "sports";

      switch (true) {
        case s.split("/")[1] == "category":
          url1 = `https://gnews.io/api/v4/top-headlines?lang=en&category=${
            s.split("/category/")[1]
          }&apikey=${apikey[n]}`;
          break;
        case s.split("/")[1] == "search":
          url1 = `https://gnews.io/api/v4/search?lang=en&q=${
            s.split("/search/")[1]
          }&apikey=${apikey[n]}`;
          break;
        default:
          url1 = `https://gnews.io/api/v4/top-headlines?lang=en&category=${category1}&apikey=${apikey[n]}`;
          url2 = `https://gnews.io/api/v4/top-headlines?lang=en&category=${category2}&apikey=${apikey[n]}`;
          url3 = `https://gnews.io/api/v4/top-headlines?lang=en&category=${category3}&apikey=${apikey[n]}`;
      }

      if (!s) {
        axios
          .all([axios.get(url1), axios.get(url2), axios.get(url3)])
          .then(
            axios.spread((obj1, obj2, obj3) => {
              setLoading(false);
              setUnavailable(false);
              setNews([
                ...obj1.data.articles,
                ...obj2.data.articles,
                ...obj3.data.articles,
              ]);
            })
          )
          .catch((error) => {
            console.log("Err in loop", n, error);
            if (n <= 1) {
              getNews(n + 1, s);
            } else if (n == 2 && error.response.status == 403) {
              setLoading(false);
              setUnavailable(true);
            }
          });
      } else {
        axios
          .get(url1)
          .then((obj1) => {
            setLoading(false);
            setUnavailable(false);
            setNews([...obj1.data.articles]);
          })
          .catch((error) => {
            console.log("Err in loop", n, error);
            if (n <= 1) {
              getNews(n + 1, s);
            } else if (n == 2 && error.response.status == 403) {
              setLoading(false);
              setUnavailable(true);
            }
          });
      }
    }
  };

  document.body.onclick = (e): void => {
    const t = e.target as HTMLElement;
    const p = t.parentNode as HTMLElement;
    p.className !== "search" && setShowSearchBar(false);
  };

  return (
    <context.Provider
      value={{ news, showSearchBar, setShowSearchBar, getNews, titleCount }}
    >
      <BrowserRouter>
        <Header />

        {loading && <div className="loading"></div>}
        {unavailable && <Unavailable />}

        <Routes>
          <Route path={"/"} element={<HeadLine />}></Route>
          <Route path={"/category/:category"} element={<ArticleList />}></Route>
          <Route path={"/search/:search"} element={<ArticleList />}></Route>
        </Routes>

        <footer>&copy;2024 DaisukeSK All Rights Reserved.</footer>
      </BrowserRouter>
    </context.Provider>
  );
}

export default App;
