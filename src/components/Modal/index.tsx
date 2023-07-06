import { Fragment, useState } from "react";
import Button from "@starlink/components/Button";
import { storage } from "@starlink/configs/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import ApiProducts from "@starlink/apis/product.api";
import { ArtistModalProps } from "src/interface/artist";
import TrashIcon from "@starlink/assets/Icons/trash";

const Modal = ({ initialData, mode, fetchData }: ArtistModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = {
    id: initialData?.id || "",
    ArtistName: initialData?.ArtistName || "",
    PackageName: initialData?.PackageName || "",
    ImageURL: initialData?.ImageURL || "",
    ReleaseDate: initialData?.ReleaseDate || "",
    SampleURL: initialData?.SampleURL || "",
    price: initialData?.price || "",
  };
  const [form, setForm] = useState(data);
  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setForm(data);
  };
  const handleImageChange = async (e: any) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file) return;
    // const allowedTypes = ["image/png", "image/jpeg"];
    // const allowedSize = 100 * 1024; // 100 KB

    // Validate file type
    // if (!allowedTypes.includes(file.type)) {
    //   alert("Tipe file yang diperbolehkan hanya PNG dan JPG.");
    //   return;
    // }

    // Validate file size
    // if (file.size > allowedSize) {
    //   alert("Ukuran file melebihi batas maksimal 100 KB.");
    //   return;
    // }

    const storageRef = ref(storage, `artist/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", async () => {
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // if (form.images.length !== 0) {
        //   const previousImageRef = ref(storage, `files/${form.images}`);
        //   await deleteObject(previousImageRef);
        // }
        setForm((prevState) => ({
          ...prevState,
          ImageURL: downloadURL,
        }));
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      if (mode === "add") {
        const REQ = {
          ArtistName: form.ArtistName,
          PackageName: form.PackageName,
          ImageURL: form.ImageURL,
          ReleaseDate: form.ReleaseDate,
          SampleURL: form.SampleURL,
          price: form.price,
        };
        ApiProducts.functionStoreData(REQ);
        Swal.fire("Berhasil", "Data berhasil ditambahkan", "success").then(
          () => {
            setForm(data);
            setIsOpen(false);
            fetchData();
          }
        );
      } else if (mode === "update") {
        ApiProducts.functionUpdateData(form);
        Swal.fire("Berhasil", "Data berhasil Diubah", "success").then(() => {
          setForm(data);
          setIsOpen(false);
          fetchData();
        });
      }
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Proses gagal",
      });
    }
  };
  console.log(form);
  return (
    <Fragment>
      <div className="flex justify-center">
        {mode === "add" ? (
          <Button
            onClick={handleOpenModal}
            className="rounded-lg bg-green-50 w-full mx-10 md:w-1/4 py-2.5 text-sm font-medium text-green-500 hover:bg-green-100 hover:text-green-600"
          >
            Tambah
          </Button>
        ) : (
          <Button onClick={handleOpenModal}>
            <TrashIcon />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-75"
            onClick={handleCloseModal}
          ></div>

          <div className="bg-white rounded-lg shadow-xl max-w-lg p-8 z-50 w-full mx-auto">
            <h1 className="text-center font-bold text-lg text-slate-800 mb-3">
              {mode === "add" ? "Tambah" : "Ubah"} Artist
            </h1>
            <form onSubmit={handleSubmit} className="space-y-3 px-3 ">
              <>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="images"
                  >
                    Foto Package
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    id="images"
                    accept="image/png, image/jpg"
                    onChange={handleImageChange}
                    required
                  />
                  <label
                    className="w-full h-28 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer"
                    htmlFor="images"
                  >
                    {form.ImageURL ? (
                      <img
                        src={form.ImageURL}
                        alt="Preview"
                        className="h-full"
                      />
                    ) : (
                      <span className="text-gray-500">Pilih Gambar</span>
                    )}
                  </label>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Package Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                      type="text"
                      id="name"
                      name="PackageName"
                      value={form.PackageName}
                      placeholder="Image Product"
                      required
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ArtistName"
                    >
                      Artist Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                      type="text"
                      id="ArtistName"
                      name="ArtistName"
                      placeholder="Artist Name"
                      value={form.ArtistName}
                      required
                      onChange={handleChangeForm}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ReleaseDate"
                    >
                      Release Date
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                      type="date"
                      id="ReleaseDate"
                      name="ReleaseDate"
                      value={form.ReleaseDate}
                      required
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="price"
                    >
                      Price
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                      type="text"
                      id="price"
                      name="price"
                      placeholder="40000"
                      value={form.price}
                      required
                      onChange={handleChangeForm}
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="SampleURL"
                  >
                    Sample Url
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    type="text"
                    id="SampleURL"
                    name="SampleURL"
                    placeholder="Sample Url"
                    value={form.SampleURL}
                    required
                    onChange={handleChangeForm}
                  />
                </div>
              </>

              <div className="flex justify-between">
                <Button
                  onClick={handleCloseModal}
                  className="rounded-lg bg-blue-50 px-8 py-2.5 text-sm font-medium border border-1 border-red-400 text-red-600"
                >
                  Cancel
                </Button>
                <Button
                  btnType="button"
                  onClick={handleSubmit}
                  className="rounded-lg  px-8 py-2.5 text-sm font-medium text-blue-500 bg-blue-100 hover:text-blue-600"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Modal;
