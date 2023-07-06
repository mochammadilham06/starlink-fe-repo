import PenIcon from "@starlink/assets/Icons/pen";
import TableHead from "./tHead";
import { ArtistRes } from "src/interface/artist";
import PlayIcon from "@starlink/assets/Icons/play";
import { useState, useEffect } from "react";
import StopIcon from "@starlink/assets/Icons/stop";
import Modal from "../Modal";
import Swal from "sweetalert2";
import { storage } from "@starlink/configs/firebase";
import { ref, deleteObject } from "firebase/storage";
import ApiProducts from "@starlink/apis/product.api";
interface ArtistProps {
  artistList: ArtistRes[] | undefined;
  fetchData: () => void;
}
const Table = ({ artistList, fetchData }: ArtistProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCurrentActve, setIsCurrentActive] = useState(0);
  const [audio] = useState(new Audio());
  const [artistListState, setArtistListState] = useState(artistList);
  useEffect(() => {
    if (
      isPlaying &&
      isCurrentActve !== null &&
      artistListState &&
      artistListState[isCurrentActve]
    ) {
      audio.src = artistListState[isCurrentActve].SampleURL;
      audio.play().catch((error) => {
        console.log("Audio playback error:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isCurrentActve, artistListState]);

  const handleTogglePlay = (sampleUrl: string, index: number) => {
    console.log(index);
    if (isCurrentActve === index) {
      setIsPlaying(!isPlaying);
    } else {
      setIsCurrentActive(index);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleDelete = (id: string, imageUrl: string) => {
    Swal.fire({
      title: "Hapus Artist?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
          ApiProducts.functionDeleteData(id);
          Swal.fire("Berhasil", "Data berhasil dihapus", "success").then(() => {
            fetchData();
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal menghapus data",
          });
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200 shadow-md m-5">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <TableHead />
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {artistList?.map((val, index) => (
            <tr className="hover:bg-gray-50" key={val.id}>
              <td className="px-6 py-4">{index + 1}</td>
              <th className="flex gap-3 px-6 py-4 font-normal text-gray-900 items-center">
                <div className="relative h-10 w-10">
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src={val.ImageURL}
                    alt=""
                  />
                  <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-700">
                    {val.PackageName}
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                  {val.ArtistName}
                </span>
              </td>
              <td className="px-6 py-4">{val.ReleaseDate}</td>
              <td className="px-6 py-4">
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => handleTogglePlay(val.SampleURL, index)}
                >
                  {index === isCurrentActve && isPlaying ? (
                    <div onClick={handleStop}>
                      <StopIcon />
                    </div>
                  ) : (
                    <PlayIcon />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                    {val.price}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-4">
                  <Modal
                    mode="update"
                    fetchData={fetchData}
                    initialData={val}
                  />

                  <button
                    onClick={() => {
                      handleDelete(val.id, val.ImageURL);
                    }}
                  >
                    <PenIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
