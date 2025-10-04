import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { HeroSlide } from "../types";
import { DeleteIcon } from "./icons";
import { ImageUpload } from "./ImageUpload";

const ManageHeroSlider = () => {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } =
    useAppContext();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Copy heroSlides from context to local state
    setSlides(heroSlides);
  }, [heroSlides]);

  const handleSlideChange = (
    id: number,
    field: keyof Omit<HeroSlide, "id">,
    value: string
  ) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const handleAddSlide = async () => {
    const newSlide = {
      imageUrl: "",
      title: "New Slide Title",
      subtitle: "New slide subtitle.",
    };
    setIsSaving(true);
    try {
      await addHeroSlide(newSlide);
      setMessage("New slide added!");
    } catch (err) {
      console.error(err);
      setMessage("Error adding slide.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateSlide = async (slide: HeroSlide) => {
    setIsSaving(true);
    try {
      await updateHeroSlide(slide.id, {
        title: slide.title,
        subtitle: slide.subtitle,
        imageUrl: slide.imageUrl,
      });
      setMessage("Slide updated!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating slide.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    setIsSaving(true);
    try {
      await deleteHeroSlide(id);
      setMessage("Slide deleted!");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting slide.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Manage Hero Slider</h3>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white p-4 rounded-lg shadow-md relative"
          >
            <button
              type="button"
              onClick={() => handleDeleteSlide(slide.id)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
              aria-label="Delete slide"
            >
              <DeleteIcon />
            </button>

            <div className="space-y-4">
              <ImageUpload
                label={`Slide ${index + 1} Image`}
                currentImage={slide.imageUrl}
                onImageChange={(dataUrl) =>
                  handleSlideChange(slide.id, "imageUrl", dataUrl)
                }
              />
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) =>
                    handleSlideChange(slide.id, "title", e.target.value)
                  }
                  onBlur={() => handleUpdateSlide(slide)}
                  className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md"
                  placeholder="Slide Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) =>
                    handleSlideChange(slide.id, "subtitle", e.target.value)
                  }
                  onBlur={() => handleUpdateSlide(slide)}
                  className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md"
                  placeholder="Slide Subtitle"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleAddSlide}
          disabled={isSaving}
          className="bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700"
        >
          Add New Slide
        </button>
        {message && <p className="text-green-600 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default ManageHeroSlider;
