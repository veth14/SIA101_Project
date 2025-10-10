import React from 'react';

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ children, open = true, onOpenChange }) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
};

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
      {children}
    </div>
  );
};

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children }) => {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
};

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children }) => {
  return <p className="text-sm text-gray-600 mt-2">{children}</p>;
};

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children }) => {
  return <div className="flex justify-end space-x-2 mt-6">{children}</div>;
};

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
