import * as React from "react";
import { Icon, IconNode } from "../Icon";
const iconNode = [
  /*#__PURE__*/ React.createElement("path", {
    d: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5L15 15l5-2v4",
    key: "171p54",
  }),
  /*#__PURE__*/ React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "2",
    key: "m1kmlw",
  }),
  /*#__PURE__*/ React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "2",
    key: "1v077h",
  }),
];
const Telephone = React.forwardRef(function Telephone(props, ref) {
  return /*#__PURE__*/ React.createElement(Icon, Object.assign({}, props, {
    ref: ref,
    iconNode: iconNode,
    iconName: "Telephone",
  }));
});
Telephone.displayName = "Telephone";
export {
  Telephone
};
