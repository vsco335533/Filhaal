import React from 'react';
import { useParams } from 'react-router-dom';

const DebateDetail: React.FC = () => {
  const params = useParams();
  const id = params.id ?? '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Debate</h1>
      <p>Debate ID: {id}</p>
    </div>
  );
};

export default DebateDetail;
