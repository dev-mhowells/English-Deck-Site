import { useParams } from "react-router-dom";

export default function Article(props) {
  //:articleTitle from App.js routing - URL param
  let params = useParams();
  // function finds artlicle object from article title which
  // is from params above, which in turn gets the value from <Link to>
  // in Card.js
  let article = props.getArticleDetails(params.articleId);

  console.log("ARTICLE", article);
  console.log(params.articleId);
  return <h2>{article.meta.title}</h2>;
}
