import { FiPlus } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart } from "@/redux/billingSlice";
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import "./Card.scss";

const Card = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");

  const products = useAppSelector((s) => s.products.items);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card__search">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search products..."
        />
      </div>

      <div className="card__grid">
        {filtered?.map((p) => (
          <button
            key={p.id}
            onClick={() =>
              dispatch(
                addToCart({
                  productId: p.id,
                  name: p.name,
                  price: p.sellingPrice,
                  quantity: 1,
                  gst: 18,
                  discount: 0,
                  total: p.sellingPrice * 1.18,
                })
              )
            }
            className="card__item"
          >
            <img
              src={p.image}
              alt={p.name}
              className="card__image"
            />

            <div className="card__title">
              {p.name}
            </div>

            <div className="card__price">
              ₹{p.sellingPrice} · stock {p.stock}
            </div>

            <div className="card__add">
              <FiPlus />
              Add to cart
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Card;