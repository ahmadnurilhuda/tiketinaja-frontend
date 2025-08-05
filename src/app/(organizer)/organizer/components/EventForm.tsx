"use client";
import React, { useState, useTransition } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Image from "next/image";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useRegional } from "@/app/context/RegionalProvider";
import { useEventCategory } from "@/app/context/EventCategoryProvider";
import { Category } from "@/types/EventCategory";
import { City } from "@/types/City";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

interface EventFormProps {
  onFormSubmit?: (
    formData: FormData
  ) => Promise<{ success: false; message: string } | void>;
  initialData?: {
    title: string;
    description: string;
    requirements: string;
    venueName: string;
    venueAddress: string;
    startDate: string;
    endDate: string;
    isOnline: boolean;
    posterUrl: string;
    venueLayoutUrl: string;
    city: City;
    eventCategory: Category;
  };
}

function EventForm({ onFormSubmit, initialData }: EventFormProps) {
  console.log("Data yang diterima EventForm:", initialData);
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(initialData);
  const { cities } = useRegional();
  const { eventCategories } = useEventCategory();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .min(3, "Judul minimal 3 karakter")
      .max(100, "Judul maksimal 100 karakter")
      .required("Judul event wajib diisi"),
    description: Yup.string()
      .trim()
      .min(11, "Deskripsi minimal 11 karakter")
      .max(500, "Deskripsi maksimal 500 karakter")
      .required("Deskripsi wajib diisi"),
    requirements: Yup.string()
      .trim()
      .min(11, "Syarat & Ketentuan minimal 11 karakter")
      .max(500, "Syarat & Ketentuan maksimal 500 karakter")
      .required("Syarat & Ketentuan wajib diisi"),
    venueName: Yup.string()
      .trim()
      .min(3, "Nama tempat minimal 3 karakter")
      .max(100, "Nama tempat maksimal 100 karakter")
      .required("Nama tempat wajib diisi"),
    venueAddress: Yup.string()
      .trim()
      .min(3, "Alamat tempat minimal 3 karakter")
      .max(100, "Alamat tempat maksimal 100 karakter")
      .required("Alamat tempat wajib diisi"),

    startDate: isEditMode
      ? Yup.date().required("Tanggal mulai wajib diisi")
      : Yup.date()
          .required("Tanggal mulai wajib diisi")
          .min(new Date(), "Tanggal mulai tidak boleh di masa lalu"),

    endDate: Yup.date()
      .required("Tanggal berakhir wajib diisi")
      .min(
        Yup.ref("startDate"),
        "Tanggal berakhir harus setelah tanggal mulai"
      ),
    isOnline: Yup.boolean(),
    poster: Yup.mixed().test(
      "isFileRequired",
      "File poster wajib diunggah",
      function (value) {
        const { initialData } = this.options.context || {};
        const hasExistingFile = !!(initialData && initialData.posterUrl);
        const hasNewFile = value instanceof File && value.size > 0;
        return hasNewFile || hasExistingFile;
      }
    ),
    venueLayout: Yup.mixed()
      .nullable()
      .test("fileType", "Venue layout harus berformat JPG", function (value) {
        if (value instanceof File && value.size > 0) {
          return SUPPORTED_FORMATS.includes(value.type);
        }
        return true;
      })
      .test(
        "fileSize",
        "Ukuran venue layout tidak boleh lebih dari 5MB",
        (value) => {
          if (value instanceof File) return value.size <= FILE_SIZE;
          return true;
        }
      ),
    cityId: Yup.string().required("Kota wajib dipilih"),
    eventCategoryId: Yup.string().required("Kategori event wajib dipilih"),
  });

  // State untuk preview gambar
  const [posterPreview, setPosterPreview] = useState(
    initialData?.posterUrl || null
  );
  const [venueLayoutPreview, setVenueLayoutPreview] = useState(
    initialData?.venueLayoutUrl || null
  );

  // Nilai awal form
  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    venueName: initialData?.venueName || "",
    venueAddress: initialData?.venueAddress || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 16)
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 16)
      : "",
    isOnline: initialData?.isOnline || false,
    poster: new File([], ""),
    venueLayout: new File([], ""),
    cityId: initialData?.city?.id || "",
    eventCategoryId: initialData?.eventCategory?.id || "",
  };

  const handleSubmit = (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => {
    if (isPending) {
      return;
    }
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("requirements", values.requirements);
    formData.append("venueName", values.venueName);
    formData.append("venueAddress", values.venueAddress);
    const startDateUTC = new Date(values.startDate).toISOString();
    const endDateUTC = new Date(values.endDate).toISOString();
    formData.append("startDate", startDateUTC);
    formData.append("endDate", endDateUTC);
    formData.append("online", values.isOnline ? "true" : "false");
    formData.append("cityId", values.cityId);
    formData.append("eventCategoryId", values.eventCategoryId);
    if (values.poster && values.poster.size > 0) {
      formData.append("poster", values.poster);
    }
    if (values.venueLayout && values.venueLayout.size > 0) {
      formData.append("venueLayout", values.venueLayout);
    }

    startTransition(async () => {
      try {
        formikHelpers.setSubmitting(true);
        if (onFormSubmit) {
           onFormSubmit(formData);
        }

        if (isEditMode) {
          toast.success("Event berhasil diperbarui.");
        } else {
          toast.success("Event berhasil dibuat.");
        }
      } catch (error) {
        console.error("GAGAL MENGIRIM FORM:", error);
        toast.error(
          (error as Error).message || "Terjadi kesalahan yang tidak diketahui."
        );
      } finally {
        formikHelpers.setSubmitting(false);
      }
    });
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {isEditMode ? "Edit Event" : "Buat Event Baru"}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        context={{ initialData }}
        enableReinitialize
      >
        {({ setFieldValue, errors, touched, isValid }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Kolom Kiri */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Judul Event
                  </label>
                  <Field
                    name="title"
                    type="text"
                    className="mt-1 block px-4 py-4 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Deskripsi (Wajib)
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    rows="5"
                    className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="requirements"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Syarat & Ketentuan (Wajib)
                  </label>
                  <Field
                    name="requirements"
                    as="textarea"
                    rows="3"
                    className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="requirements"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="isOnline"
                    className="text-sm font-medium text-gray-700"
                  >
                    Jenis Event
                  </label>
                  <Field
                    as="select"
                    name="isOnline"
                    id="isOnline"
                    className="rounded px-4 py-2 border border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih jenis event</option>
                    <option value="true">Online</option>
                    <option value="false">Offline</option>
                  </Field>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Waktu Mulai
                    </label>
                    <Field
                      name="startDate"
                      type="datetime-local"
                      className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Waktu Berakhir
                    </label>
                    <Field
                      name="endDate"
                      type="datetime-local"
                      className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="venueName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nama Tempat / Venue
                  </label>
                  <Field
                    name="venueName"
                    type="text"
                    className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="venueName"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="venueAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Alamat Tempat
                  </label>
                  <Field
                    name="venueAddress"
                    as="textarea"
                    rows="2"
                    className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="venueAddress"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="eventCategoryId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kategori
                    </label>
                    <Field
                      as="select"
                      name="eventCategoryId"
                      className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kategori</option>
                      {eventCategories.map((cat: Category) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="eventCategoryId"
                      component="div"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cityId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kota
                    </label>
                    <Field
                      as="select"
                      name="cityId"
                      className="mt-1 block w-full px-4 py-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kota</option>
                      {cities.map((city: City) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="cityId"
                      component="div"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Gambar (di bawah, membentang penuh) */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Poster Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poster Event (Wajib)
                  </label>
                  <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                    {posterPreview ? (
                      <Image
                        src={
                          posterPreview.startsWith("blob:")
                            ? posterPreview
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${posterPreview}`
                        }
                        alt="Poster Preview"
                        width={200}
                        height={192}
                        className="h-full w-auto object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon size={48} />
                        <p className="mt-2 text-sm">
                          Preview akan tampil di sini
                        </p>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="poster"
                    className="cursor-pointer mt-2 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <Upload size={16} /> Pilih File Poster
                    <input
                      id="poster"
                      name="poster"
                      type="file"
                      accept="image/jpeg,image/jpg"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue("poster", file);
                          setPosterPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  <ErrorMessage
                    name="poster"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                {/* Layout Venue Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout Venue (Opsional)
                  </label>
                  <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                    {venueLayoutPreview ? (
                      <Image
                        src={
                          venueLayoutPreview.startsWith("blob:")
                            ? venueLayoutPreview
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${venueLayoutPreview}`
                        }
                        alt="Venue Layout Preview"
                        width={200}
                        height={192}
                        className="h-full w-auto object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImageIcon size={48} />
                        <p className="mt-2 text-sm">
                          Preview akan tampil di sini
                        </p>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="venueLayout"
                    className="cursor-pointer mt-2 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <Upload size={16} /> Pilih File Layout
                    <input
                      id="venueLayout"
                      name="venueLayout"
                      type="file"
                      accept="image/jpeg,image/jpg"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue("venueLayout", file);
                          setVenueLayoutPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending || !isValid}
                className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isPending
                  ? "Menyimpan..."
                  : isEditMode
                  ? "Simpan Perubahan"
                  : "Buat Event"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EventForm;
