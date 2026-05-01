import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  phone: string;
  email: string;
  city: string;
  requirement_type: string;
  budget_range: string;
  message?: string;
  coupon?: string;
};

export default function LeadForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const watchBudget = watch("budget_range");

  // Convert budget to numeric price
  const getBudgetValue = (budget: string) => {
    switch (budget) {
      case "₹0 - ₹500":
        return 500;
      case "₹500 - ₹1000":
        return 1000;
      case "₹1000 - ₹5000":
        return 5000;
      case "₹5000+":
        return 10000;
      default:
        return 0;
    }
  };

  // Update price when budget changes
  useEffect(() => {
    const price = getBudgetValue(watchBudget);
    setFinalPrice(price);
    setDiscount(0);
  }, [watchBudget]);

  // Apply Coupon
  const applyCoupon = async (data: FormData) => {
    try {
      const price = getBudgetValue(data.budget_range);
      if (!price) {
        return toast.error("Please select budget first..!");
      }
      const res = await API.post("/coupon/apply", {
        code: data.coupon,
        price: price,
        requirementType: data.requirement_type,
      });
      if (res.data.success) {
        setDiscount(res.data.discount);
        setFinalPrice(res.data.finalPrice);

        setMsg("Coupon applied successfully");
      } else {
       setMsg(res.data.message);
      }
    } catch (err) {
      setMsg("Error applying coupon");
    }
  };

  // Submit Form
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await API.post("/lead/submit", {
        ...data,
        coupon_code: data.coupon,
        discount_amount: discount,
        final_price: finalPrice,
      });
      if (res.data.success) {
        toast.success("Form submitted successfully");

        reset();
        setDiscount(0);
        setFinalPrice(0);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Submission failed ");
    }
    setLoading(false);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Get a Quote
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <input className="input" placeholder="Name" {...register("name", { required: "Name is required" })} />
            <p className="error">{errors.name?.message}</p>
          </div>

          <div>
            <input className="input" placeholder="Phone Number"
              {...register("phone", {
                required: "Phone is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid number" },
              })}
            />
            <p className="error">{errors.phone?.message}</p>
          </div>

          <div>
            <input className="input" placeholder="Email"
              {...register("email", {
                required: "Email required",
                pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
              })}
            />
            <p className="error">{errors.email?.message}</p>
          </div>

          <div>
            <select className="input" {...register("city", { required: "Select city" })}>
              <option value="">Select City</option>
              <option>Chennai</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Mumbai</option>
            </select>
            <p className="error">{errors.city?.message}</p>
          </div>

          <div>
            <select className="input" {...register("requirement_type", { required: "Required" })}>
              <option value="">Select Requirement</option>
              <option>Service</option>
              <option>Product</option>
              <option>Consultation</option>
            </select>
            <p className="error">{errors.requirement_type?.message}</p>
          </div>

          <div>
            <select className="input" {...register("budget_range", { required: "Select budget" })}>
              <option value="">Select Budget</option>
              <option>₹0 - ₹500</option>
              <option>₹500 - ₹1000</option>
              <option>₹1000 - ₹5000</option>
              <option>₹5000+</option>
            </select>
            <p className="error">{errors.budget_range?.message}</p>
          </div>

        </div>

        {/* Full Width */}
        <div className="mt-4">

          <textarea className="input" placeholder="Message (optional)" {...register("message")} />

          <div className="flex gap-2">
            <input className="input flex-1" placeholder="Coupon Code" {...register("coupon")} />
            <button
              type="button"
              onClick={handleSubmit(applyCoupon)}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 rounded"
            >
              Apply
            </button>
          </div>

          {/* Price */}
          <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
            <p>Discount: ₹{discount}</p>
            <p className="font-semibold">Final Price: ₹{finalPrice}</p>
            <p className="text-green-600">{msg}</p>
          </div>

        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-xl mt-6"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
);
}