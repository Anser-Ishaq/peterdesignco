export default function Dashboard() {
  const dashboardDetails = [
    {
      id: 1,
      title: "Team Members",
      number: "05",
      bg: "#556ee6",
    },
    {
      id: 2,
      title: "Total Products",
      number: "05",
      bg: "#34c38f",
    },
    {
      id: 3,
      title: "Leads",
      number: "100",
      bg: "#50a5f1",
    },
    {
      id: 4,
      title: "Courses",
      number: "05",
      bg: "#f1b44c",
    },
  ];
  return (
    <>
      <h1 className="text-[60px] font-extrabold">Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard!</p>

      <div className="grid grid-cols-4 gap-4 mt-10">
        {dashboardDetails.map((item, idx) => (
          <div
            style={{ backgroundColor: item.bg, borderColor: item.bg }}
            key={item.id}
            className={`border  text-black p-3 rounded-2xl`}
          >
            <p className="text-2xl font-medium">{item.title}</p>
            <p className="text-xl font-normal">{item.number}</p>
          </div>
        ))}
      </div>
    </>
  );
}
