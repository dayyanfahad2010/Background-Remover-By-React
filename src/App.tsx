import { removeBackground } from "@imgly/background-removal";
import { useRef, useState } from "react";

const App = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select the valid image file");
      return;
    }
    setError(null);
    setProcessedImage(null);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setOriginalImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const blob = await removeBackground(file);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError("Failed to processed image.Please try another image.");
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTranser.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    handleFileSelect(file);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    link.click();
    URL.revokeObjectURL(processedImage);
  };

  const resetApp = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="xl:flex flex-row gap-x-8 mx-5 my-6 mx-auto w-[80%] min-h-[83vh] lg:block ">
      <div
        className="basis-128 rounded-lg xl:w-[48%] w-[100%]shadow-xl h-80 mt-12 py-5 bg-[#FFFFFF]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2 className="text-[#3C4043] font-bold text-xl font-montserrat mt-2 ml-5 mb-3">
          <span className="text-[#FF5A5F]">✨</span>Background Removal
        </h2>
        <h4 className="px-6 text-[#3C4043]">Upload File</h4>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/"
          onChange={handleFileInputChange}
          className="w-110 px-5 py-3 rounded-xl mx-6 my-1 border-2 border-gray-700"
        />
        <span className="px-6 text-gray-700">
          Supports JPG,PNG and other image format
        </span>
        <button className="bg-gradient-to-r from-[#FDC830] via-[#F37335] to-[#C02425] w-110 px-5 py-3 rounded-xl mx-6 mt-10">
          Remove Background
        </button>
        {error && <div className="text-center mb-4">{error}</div>}
      </div>
      <div className="basis-128 rounded-xl shadow-xl xl:w-[48%] w-[100%] min-h-120 mt-12 py-5 px-4 bg-[#FFFFFF]">
        {!originalImage && (
          <div className="">
            <h2 className="text-[#3C4043] font-bold text-xl font-montserrat mt-2 ml-5 mb-3">
              <span className="text-[#FF5A5F] ">🩹 </span>Processed Image
            </h2>
            <p className="text-center text-gray-700 mt-42 text-lg mb-2">🩹</p>
            <p className="text-center text-gray-700 ">
              Upload an image to Remove Background to get started
            </p>
          </div>
        )}
        {originalImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-[#3C4043] font-bold text-lg font-montserrat mt-2  mb-2">
                Original
              </div>
              <div className="aspect-square w-full max-w-md mx-auto border-2 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={originalImage}
                  alt="Original"
                  className="object-contain w-[100%] h-[100%]"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[#3C4043] font-bold text-lg font-montserrat mt-2 mb-2">
                Background Removed
              </div>
              <div className="aspect-square w-full max-w-md mx-auto border-2 rounded-2xl overflow-hidden flex items-center justify-center">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed Image"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify center w-full h-full ">
                    {isProcessing ? (
                      <div className="flex items-center gap-2 py-10">
                        <div className="animate-spin w-6 h-6 border-2 border-t-fushsia-100 rounded-full "></div>
                        Processing...
                      </div>
                    ) : (
                      <span>Processed Image will appear here</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {originalImage && (
          <div>
            <button
              onClick={downloadImage}
              disabled={!processedImage}
              className="bg-gradient-to-r from-[#FDC830] via-[#F37335] to-[#C02425] w-110 px-5 py-3 rounded-xl mx-6 my-2 hover:opacity-80 text-white disabled:opacity-50 disabled:cursor-not-allowd cursor-pointer"
            >
              {processedImage ? "Download Image" : "Processing..."}
            </button>
            <button
              className="bg-gradient-to-r from-[#FDC830] via-[#F37335] to-[#C02425] w-110 px-5 py-3 rounded-xl mx-6 my-2 hover:opacity-80 text-white disabled:opacity-50 disabled:cursor-not-allowd cursor-pointer"
              onClick={resetApp}
            >
              Processed another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
