import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Card className="p-10 max-w-md w-full text-center">
        <CardHeader className="p-0 mb-6">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          </div>
          <CardTitle className="text-2xl text-blue-600">Processing Payment...</CardTitle>
        </CardHeader>
        <p className="text-gray-600">
          Please wait while we process your payment. You will be redirected automatically once completed.
        </p>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;