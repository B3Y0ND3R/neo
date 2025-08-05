import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Card className="p-10 max-w-md w-full text-center">
        <CardHeader className="p-0 mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. You can view your order details in your account.
        </p>
        <Button 
          className="w-full" 
          onClick={() => navigate("/shop/account")}
        >
          View Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;