"use client";

import { useState } from "react";
import Link from "next/link";

import { StatusBadge } from "@/components/orders/StatusBadge";
import { DeleteOrderButton } from "@/components/orders/DeleteOrderButton";


const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});


const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});


type OrderListItem = {
  id: string;
  title: string;
  amount: number;
  status: "new" | "in_progress" | "completed" | "cancelled";
  deadline: string;
  clientName: string;
  clientId: string;
};


type OrderListProps = {
  orders: OrderListItem[];

  deleteAction: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};



function formatDate(date:string){
  return dateFormatter.format(new Date(date));
}



export function OrderList({
  orders,
  deleteAction,
}: OrderListProps) {


  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("all");


  const filteredOrders = orders.filter((order)=>{

    const query = search.toLowerCase();


    const matchesSearch =
      order.title.toLowerCase().includes(query) ||
      order.clientName.toLowerCase().includes(query);


    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter;


    return matchesSearch && matchesStatus;

  });



  return (

    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">


      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">


        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Поиск заказов..."
          className="flex-1 rounded-xl border px-4 py-3 dark:bg-zinc-950"
        />


        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
          className="rounded-xl border px-4 py-3 dark:bg-zinc-950"
        >

          <option value="all">
            Все
          </option>

          <option value="new">
            Новый
          </option>

          <option value="in_progress">
            В работе
          </option>

          <option value="completed">
            Завершён
          </option>

          <option value="cancelled">
            Отменён
          </option>

        </select>


      </div>



      <div className="divide-y dark:divide-zinc-800">


        {filteredOrders.map((order)=>(

          <div
            key={order.id}
            className="p-5 transition hover:bg-zinc-50 dark:hover:bg-zinc-950"
          >


            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


              <div>

                <Link
                  href={`/orders/${order.id}/edit`}
                  className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {order.title}
                </Link>


                <div className="mt-2">

                <Link
  href={`/clients/${order.clientId}`}
  className="text-sm text-zinc-500 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-white"
>
  👤 {order.clientName}
</Link>

                </div>


              </div>



              <StatusBadge status={order.status}/>


            </div>



            <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">


              <div>

                <p className="text-xl font-semibold">
                  {currencyFormatter.format(order.amount)}
                </p>


                <p className="text-zinc-500">
                  Дедлайн: {formatDate(order.deadline)}
                </p>

              </div>



              <div className="flex gap-3">


                <Link
                  href={`/orders/${order.id}/edit`}
                  className="rounded-xl border px-4 py-2 text-sm font-medium"
                >
                  Изменить
                </Link>


                <DeleteOrderButton
                  orderId={order.id}
                  action={deleteAction}
                />


              </div>


            </div>


          </div>


        ))}


      </div>


    </div>

  );
}