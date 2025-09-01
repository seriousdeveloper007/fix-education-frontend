import PropTypes from 'prop-types';

const getDifficultyColor = (level) => {
  if (level === 'easy') return 'bg-green-100 text-green-700';
  if (level === 'medium') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

export function DifficultyBadge({ level }) {
  return (
    <div className={`shrink-0 px-2 py-0.5 text-xs rounded ${getDifficultyColor(level)}`}>
      {level}
    </div>
  );
}

DifficultyBadge.propTypes = {
  level: PropTypes.string.isRequired,
};