import { useParams } from "react-router-dom";

export default function Article(props) {
  //:articleTitle from App.js routing - URL param
  let params = useParams();
  // function finds artlicle object from articleID which
  // is from params above, which in turn gets the value from <Link to>
  // in Card.js - cannot find by title because spaces etc.
  let article = props.getArticleDetails(params.articleId);

  console.log("THIS IS ARTICLE", article);

  return <h2>{article.articleInfo.title}</h2>;
}
