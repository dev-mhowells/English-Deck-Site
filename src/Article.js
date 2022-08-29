import { useParams } from "react-router-dom";
import { getArticleDetails } from "./App.js";

export default function Article(props) {
  let params = useParams();

  let article = props.getArticleDetails(params.articleTitle);

  return <h2>{article.title}</h2>;
}
