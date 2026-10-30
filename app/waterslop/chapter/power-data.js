// References and rail values come from OCRPCB.kicad_sch. Positions come from
// the PCB footprint coordinates registered to PCBwithCamera.step, in mm.
export const powerChips = [
  {
    id: "U2",
    name: "TPS63021",
    role: "3.3 V regulator",
    description:
      "Raises or lowers the battery voltage to a steady 3.3 V. This supplies the ESP32 and the board's 3.3 V devices as the battery discharges.",
    position: [6.03127, -6.66434, -0.7],
    mesh: /^TPS63020DSJR__/,
    schematic: "schematics/U2.svg",
    source: "https://www.ti.com/product/TPS63021",
  },
  {
    id: "U11",
    name: "TPS61023",
    role: "5 V boost converter",
    description:
      "Raises the supply to 5 V for the fan. Its enable pin lets the ESP32 switch this rail off when it is not needed.",
    position: [-2.20748, -3.82809, -0.9],
    mesh: /^(BODY-SOT|FRAME-DRL0006A)__/,
    schematic: "schematics/U11.svg",
    source: "https://www.ti.com/product/TPS61023",
  },
  {
    id: "U4",
    name: "MIC5365",
    role: "2.8 V camera supply",
    description:
      "Regulates 3.3 V down to 2.8 V for the camera's analogue supply. The camera needs this separate rail alongside its digital supplies.",
    position: [-2.22748, -16.14559, -0.7],
    mesh: /^SOT-353_SC-70-5__/,
    schematic: "schematics/U4.svg",
    source: "https://www.microchip.com/en-us/product/mic5365",
  },
  {
    id: "U5",
    name: "TPS7A03",
    role: "1.5 V camera supply",
    description:
      "Provides 1.5 V for the camera's digital core. A separate regulator supplies the voltage this part of the camera needs.",
    position: [-2.15748, -12.53309, -0.5],
    mesh: /^SOT-23-5__/,
    schematic: "schematics/U5.svg",
    source: "https://www.ti.com/product/TPS7A03",
  },
  {
    id: "U8",
    name: "BQ24074",
    role: "Battery charging",
    description:
      "Charges the single-cell lithium battery from USB and supplies the system while USB is connected. Its power path keeps the board running while the battery charges.",
    position: [3.91627, -15.07934, -0.8],
    mesh: /^RGT16__/,
    schematic: "schematics/U8.svg",
    source: "https://www.ti.com/product/BQ24074",
  },
  {
    id: "U7",
    name: "BQ29700",
    role: "Battery protection",
    description:
      "Monitors the cell voltage and current. It controls the two external MOSFETs to disconnect the battery during overcharge, deep discharge or excessive current.",
    position: [3.26127, -22.64434, -0.8],
    mesh: /^DSE6__/,
    schematic: "schematics/U7.svg",
    source: "https://www.ti.com/product/BQ2970",
  },
  {
    id: "U10",
    name: "MAX17048",
    role: "Battery gauge",
    description:
      "Estimates the battery's remaining charge and reports it over I2C. The ESP32 can use this reading to track battery life and reduce activity when charge is low.",
    position: [8.44627, -16.75434, -0.8],
    mesh: /^MAX17048G\+T10__/,
    schematic: "schematics/U10.svg",
    source: "https://www.analog.com/en/products/max17048.html",
  },
];
export function powerChipForMesh(name) {
  return powerChips.find((chip) => chip.mesh.test(name))?.id ?? null;
}
