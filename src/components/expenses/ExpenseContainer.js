import React, { useEffect, useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";

export const ExpenseContainer = () => {

  return (
    <>
      <ExpenseForm/>
      <ExpenseList />
    </>
  )
};
