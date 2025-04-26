type FormData = {
  propertyValue: string;
  venalValue: string;
};

const formatValue = (value: string) => {
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
};

const calculateITBI = (
  formData: FormData,
  aliquot: number,
  validateForm: () => boolean,
  setErrorMessage: (message: string) => void,
  setShowErrorModal: (show: boolean) => void,
  setResult: (result: number) => void,
  setShowSuccessModal: (show: boolean) => void
) => {
  if (!validateForm()) {
    setErrorMessage("Por favor, preencha todos os campos corretamente.");
    setShowErrorModal(true);
    return;
  }

  const propertyValue = formatValue(formData.propertyValue);
  const venalValue = formatValue(formData.venalValue);

  let itbi = 0;

  if (propertyValue > venalValue) {
    itbi = (propertyValue * aliquot) / 100;
  } else {
    itbi = (venalValue * aliquot) / 100;
  }

  setResult(itbi);
  setShowSuccessModal(true);
};

export default calculateITBI;
