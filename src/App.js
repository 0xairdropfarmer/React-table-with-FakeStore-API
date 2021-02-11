import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Table from "./components/Table";
export default function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => setProducts(json));
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Product Image",
        accessor: "image",
        Cell: ({ value }) => {
          return (
            <img
              alt="product"
              class="img-fluid img-rounded"
              width={200}
              src={value}
            />
          );
        }
      },
      {
        Header: "Product Title",
        accessor: "title" // accessor is the "key" in the data
      },
      {
        Header: "Product Price",
        accessor: "price"
      },
      {
        Header: "Product Description",
        accessor: "description"
      }
    ],
    []
  );
  return (
    <div className="App">
      <h1>Example of React table with FakeStore API</h1>
      <Table columns={columns} data={products} />
    </div>
  );
}
