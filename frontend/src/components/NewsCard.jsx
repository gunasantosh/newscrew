
import ReactMarkdown from "react-markdown";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from 'prop-types';

const NewsCard = ({ title, content }) => {
  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        {title.replace(/_/g, " ")}
      </Typography>
      <CardContent>
        <ReactMarkdown>{content}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};
NewsCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default NewsCard;

