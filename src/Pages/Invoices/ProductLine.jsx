import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import { t } from "i18next";
import { toast } from "react-toastify";
import { deleteProductLine } from "../../services/api";

const ProductLinesTable = ({ productLines, invoiceId }) => {
  const [lines, setLines] = useState(
    Array.isArray(productLines) ? productLines : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLines(Array.isArray(productLines) ? productLines : []);
  }, [productLines]);

  const TABLE_HEAD = [
    { label: t("productName"), key: "productName" },
    { label: t("quantity"), key: "quantity" },
    { label: t("price"), key: "unitPrice" },
    { label: t("total"), key: "totalPrice" },
    { label: t("actions"), key: "actions" },
  ];

  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const handleDelete = async (lineId) => {
    setLoading(true);
    try {
      await deleteProductLine(lineId, invoiceId);
      setLines(lines.filter((line) => line._id !== lineId));
      toast.success("Product line deleted successfully", options);
    } catch (error) {
      toast.error(error.message || t("Failed to delete product line"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto mt-5">
      <h1 className="title text-center my-4 font-semibold">{t("PL")}</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200 text-xs md:text-sm lg:text-base">
            {TABLE_HEAD.map((item, index) => (
              <th key={index} className="p-2 md:p-4 text-left">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(lines) && lines.length > 0 ? (
            lines.map((line, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 text-xs md:text-sm lg:text-base"
              >
                {TABLE_HEAD.map((item, headIndex) => (
                  <td key={headIndex} className="px-2 md:px-4 text-left">
                    {item.key === "actions" ? (
                      <button
                        onClick={() => handleDelete(line._id)}
                        disabled={loading}
                      >
                        <span>
                          <TrashIcon className="text-red-500 h-5 w-5" />
                        </span>
                      </button>
                    ) : item.key === "productName" ? (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {line.product.name || "N/A"}
                      </Typography>
                    ) : item.key === "quantity" ? (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {line.qty || "N/A"}
                      </Typography>
                    ) : item.key === "unitPrice" ? (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        ${line.product.unitPrice || "N/A"}
                      </Typography>
                    ) : item.key === "totalPrice" ? (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        ${line.total || "N/A"}
                      </Typography>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                No product lines available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductLinesTable;
