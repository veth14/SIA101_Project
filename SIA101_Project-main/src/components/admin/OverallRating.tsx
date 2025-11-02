import React from 'react';

interface RatingCategory {
  name: string;
  score: number;
}

interface OverallRatingProps {
  averageRating: number;
  totalReviews: number;
  categories: RatingCategory[];
}

export const OverallRating: React.FC<OverallRatingProps> = ({
  averageRating,
  totalReviews,
  categories
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Overall Rating</h2>
      <div className="flex items-start gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-heritage-green mb-2">
            {averageRating.toFixed(1)}
            <span className="text-xl text-gray-400">/5</span>
          </div>
          <div className="text-sm text-gray-500">
            Based on {totalReviews} reviews
          </div>
        </div>
        <div className="flex-1">
          {categories.map((category) => (
            <div key={category.name} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{category.name}</span>
                <span className="font-medium">{category.score.toFixed(1)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-heritage-green rounded-full"
                  style={{ width: `${(category.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
