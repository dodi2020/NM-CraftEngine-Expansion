module.exports.regiter = (nm) => {
  const icon = nm.loadAsset(__dirname + "../assets/fuel.png");

  nm.postEditorModule({
    name: "fuel-time",
    display: "Fuel Time",
    plugins: ["craftengine"],
    compatibility: ["weapon", "tool", "item"],
    description: "The thime of the Fuel if you put it into a funace.",
    icon: icon,
    type: "number",
    default: 100,
  });
}