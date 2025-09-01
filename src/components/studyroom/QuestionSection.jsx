import PropTypes from 'prop-types';

export function QuestionSection({ title, theme, children }) {
  return (
    <div>
      <div className={`${theme.cardHeadingSecondary} mb-2`}>
        {title}
      </div>
      {children}
    </div>
  );
}

QuestionSection.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
