import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const DogChart = ({ data }) => {
  const ageCategoryCounts = {};

  data.forEach((animal) => {
    const ageCategory = animal.age;
    ageCategoryCounts[ageCategory] = (ageCategoryCounts[ageCategory] || 0) + 1;
  });

  const ageCategoryData = Object.keys(ageCategoryCounts).map((ageCategory) => ({
    ageCategory,
    count: ageCategoryCounts[ageCategory],
  }));

  return (
    <BarChart width={500} height={300} data={ageCategoryData}>
      <CartesianGrid stroke="#fff" strokeDasharray="5 5" />
      <XAxis dataKey="ageCategory" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip contentStyle={{ background: "#000" }} />
      <Legend wrapperStyle={{ color: "#fff" }} />
      <Bar dataKey="count" fill="#eedd9e" />
    </BarChart>
  );
};

export default DogChart;