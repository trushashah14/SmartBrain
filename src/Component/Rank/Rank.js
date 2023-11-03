import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>
    <strong> 
      <div className='black f4'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='black f1'>
        {entries}
      </div>
      </strong>
    </div>
  );
}

export default Rank;