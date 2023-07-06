import ApiProducts from "@starlink/apis/product.api";
import Modal from "@starlink/components/Modal";
import Navbar from "@starlink/components/Navbar";
import Spinner from "@starlink/components/Spinner";
import Table from "@starlink/components/Table";
import { Fragment, useEffect, useState } from "react";
import { ArtistRes } from "src/interface/artist";

const HomePage = () => {
  const [artistList, setArtistList] = useState<ArtistRes[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { artist } = await ApiProducts.functionGetData();
      setArtistList(artist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Fragment>
      <Navbar />
      <Modal fetchData={fetchData} mode="add" />
      {loading ? (
        <Spinner />
      ) : artistList?.length !== 0 ? (
        <Fragment>
          <section id="main">
            <Table artistList={artistList} fetchData={fetchData} />
          </section>
        </Fragment>
      ) : (
        <p className="text-center text-3xl font-bold mt-36">Tidak ada data</p>
      )}
    </Fragment>
  );
};

export default HomePage;
