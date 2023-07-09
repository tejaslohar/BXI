// react query to fetch all data from api
import { useQuery } from "react-query";
import axios from "axios";


const useGetAllProducts = () => {
  const { data, error, isLoading } = useQuery("products", () =>
    axios.get("product/get_all_products").then((res) => res.data)
  );

  return { data, error, isLoading };

};

export default useGetAllProducts;