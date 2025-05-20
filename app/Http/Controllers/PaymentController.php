<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Events\OrderPlaced;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\OrderPlacedNotification;

class PaymentController extends Controller
{
    public function storePayment(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)->where('user_id', $user->id)->where('status', 'pending')->first();
        if (!$order) {
            return response()->json(['message' => 'No pending order found'], 404);
        }

        $request->validate([
            'amount' => 'required|numeric',
        ]);

        do
        {
            $transactionId = 'TXN' . Str::random(10);
        } while (Payment::where('transaction_id', $transactionId)->exists());

        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'amount' => $request->amount,
            'status' => 'completed',
            'transaction_id' => $transactionId,
        ]);

        //update order status to completed
        $order->update([
            'status' => 'completed',
        ]);

        //conditions whether it will be cancelled or not(not required yet)
        
        $user->notify(new OrderPlacedNotification($order));

        return redirect()->route('order.show', $order->id)
        ->with([
            'success' => 'Payment successful. Transaction ID: ' . $transactionId,
            'payment_id' => $payment->id, // optional if you need it
        ]);
    }

    public function storeCancelledPayment(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)->where('user_id', $user->id)->whereIn('status', ['pending', 'completed'])->first();
        if (!$order) {
            return response()->json(['message' => 'No pending order found'], 404);
        }

        $request->validate([
            'amount' => 'required|numeric',
        ]);

        do
        {
            $transactionId = 'TXN' . Str::random(10);
        } while (Payment::where('transaction_id', $transactionId)->exists());

        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'amount' => $request->amount,
            'status' => 'cancelled',
            'transaction_id' => $transactionId,
        ]);

        //update order status to cancelled
        $order->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Payment cancelled successfully',
            'payment' => $payment,
        ], 201);
    }
}
