<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\OrderPlacedNotification;

use Illuminate\Support\Facades\Session;

class SendOrderConfirmationNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
     public function handle(OrderPlaced $event)
    {
        $order = $event->order;
        $user = $order->user;

        // Notify the user with an in-app notification
        $user->notify(new OrderPlacedNotification($order));

         // Store a flag in the session
        Session::flash('order_placed_notification', true);

        // Or store a message with order details
        Session::flash('order_placed_message', 'Your order ID ' . $order->id . ' has been placed!');
    }
}
