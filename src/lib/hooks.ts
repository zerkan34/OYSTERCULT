import { useEffect, useState, useRef, FormEvent } from 'react';
import { useStore } from './store';

// Improved useClickOutside hook with better handling of nested modals
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Créer une fonction qui vérifie si le clic est en dehors de la référence
    const handleClickOutside = (event: MouseEvent) => {
      // Si la référence existe et que le clic est en dehors de celle-ci
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Vérifier si l'élément cliqué est une autre modale ou est à l'intérieur d'une autre modale
        // On utilise closest pour trouver l'ancêtre le plus proche qui a la classe 'modal-container'
        const clickedOnAnotherModal = (event.target as Element).closest('.modal-container');
        
        // Si l'élément cliqué n'est pas dans une autre modale, alors on peut fermer cette modale
        if (!clickedOnAnotherModal) {
          callback();
        }
      }
    };

    // Utiliser mousedown pour capturer le clic initial
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

// Form validation hook
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (fieldName: keyof T, value: any): string | null => {
    const rule = validationRules[fieldName];
    return rule ? rule(value) : null;
  };

  const handleChange = (fieldName: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    const error = validate(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSubmit = async (
    e: FormEvent,
    onSubmit: (values: T) => Promise<void>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Partial<Record<keyof T, string>> = {};
    Object.keys(validationRules).forEach((key) => {
      const error = validate(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // Handle error appropriately
      }
    }

    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues
  };
};

// Touch gesture hook
export const useTouchGestures = (
  onRefresh?: () => Promise<void>,
  onDoubleTap?: () => void
) => {
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = async (e: TouchEvent) => {
    if (isRefreshing) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;

    if (deltaY > 100 && deltaTime < 300 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const now = Date.now();
    if (now - lastTapTime < 300 && onDoubleTap) {
      onDoubleTap();
    }
    setLastTapTime(now);
  };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    isRefreshing
  };
};

// Modal state management hook with nested modals support
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  // Créer une référence qui ne fermera pas la modale lorsqu'on clique à l'intérieur
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        // Vérifier si l'élément cliqué est une autre modale ou est à l'intérieur d'une autre modale
        const clickedOnAnotherModal = (event.target as Element).closest('.modal-container');
        
        // Si l'élément cliqué n'est pas dans une autre modale, alors on peut fermer cette modale
        if (!clickedOnAnotherModal) {
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    modalRef,
    open,
    close,
    toggle
  };
};

// Form dirty state tracking hook
export const useFormDirty = <T extends Record<string, any>>(initialValues: T) => {
  const [isDirty, setIsDirty] = useState(false);
  const [originalValues] = useState(initialValues);
  const [currentValues, setCurrentValues] = useState(initialValues);

  const checkDirty = (values: T) => {
    const isDifferent = Object.keys(originalValues).some(
      key => originalValues[key] !== values[key]
    );
    setIsDirty(isDifferent);
  };

  const handleChange = (fieldName: keyof T, value: any) => {
    const newValues = {
      ...currentValues,
      [fieldName]: value
    };
    setCurrentValues(newValues);
    checkDirty(newValues);
  };

  const reset = () => {
    setCurrentValues(originalValues);
    setIsDirty(false);
  };

  return {
    isDirty,
    currentValues,
    handleChange,
    reset
  };
};