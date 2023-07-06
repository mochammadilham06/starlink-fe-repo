import axiosInstance from "@starlink/configs/axiosInstance";

const ApiProducts = {
  async functionGetData() {
    try {
      const { data } = await axiosInstance.get(`/artist`);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  },

  async functionStoreData(props?: any) {
    try {
      const res = await axiosInstance.post(`/artist`, props);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  },

  async functionUpdateData(props?: any) {
    try {
      const res = await axiosInstance.put(`/artist/${props.id}`, props);
      return res;
    } catch (error) {
      console.log(error);
    }
  },

  async functionDeleteData(id?: string) {
    try {
      const res = await axiosInstance.delete(`/artist/${id}`);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
};

export default ApiProducts;
