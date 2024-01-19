import { useState } from "react";

const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startSubmitting = () => setIsSubmitting(true);
  const stopSubmitting = () => setIsSubmitting(false);

  return { isSubmitting, startSubmitting, stopSubmitting };
};

export default useFormSubmission;
