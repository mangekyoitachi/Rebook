import { usePage } from "@inertiajs/react";
import react from "react";
import PassPropTest from "./PassPropTest"; // ipasok mo sa prop na ito

function ReactTest(){

     const {
        carts,
        categories,
        cartItems,
        orders,
        orderItems,
        payments,
        products,
        reviews,
        shippings,
        shops,
        users,
    } = usePage().props;

    console.log('🛒 carts --->', carts);
    console.log('🧾 cartItems --->', cartItems);
    console.log('📦 categories --->', categories);
    console.log('🛍️ orders --->', orders);
    console.log('🧩 orderItems --->', orderItems);
    console.log('💳 payments --->', payments);
    console.log('🧃 products --->', products);
    console.log('⭐ reviews --->', reviews);
    console.log('🚚 shippings --->', shippings);
    console.log('🏬 shops --->', shops);
    console.log('👤 users --->', users);

    return(
        <>
            {/* {users} ---> napaka mali nito dahil object to*/}

            {/* {users.map(user => (
                // {user} ---> mali parin ito kasi object my id to
                // ganito ang tamang pag retrieve ng data
                <li key={user.id}>
                    {user.name} - {user.email}
                </li>
            ))} */}

            <PassPropTest
                carts={carts}
                cartItems={cartItems}
                categories={categories}
                orders={orders}
                orderItems={orderItems}
                payments={payments}
                products={products}
                reviews={reviews}
                shippings={shippings}
                shops={shops}
                users={users}
            /> {/** ganito mag pasa sa components */}

        </>
    )


}

export default ReactTest
