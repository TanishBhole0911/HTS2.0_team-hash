"use client";
import React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import "../styles/MindMap.css";

interface MindmapItem {
  key: string;
  category: string;
  text: string;
}

interface LinkData {
  from: string;
  to: string;
  text: string;
}

interface MindMapProps {
  nodeDataArray: MindmapItem[];
  linkDataArray: LinkData[];
  height?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  person:       "#818cf8",
  character:    "#818cf8",
  event:        "#fb923c",
  location:     "#34d399",
  group:        "#a78bfa",
  organization: "#60a5fa",
  concept:      "#e879f9",
  book:         "#4f46e5",
  author:       "#7c3aed",
  chapter:      "#0ea5e9",
  vehicle:      "#14b8a6",
  school:       "#f59e0b",
  name:         "#f472b6",
};

const MindMap: React.FC<MindMapProps> = ({ nodeDataArray, linkDataArray, height = 420 }) => {
  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      "animationManager.isEnabled": true,
      allowZoom: true,
      allowMove: true,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      layout: $(go.LayeredDigraphLayout, {
        direction: 90,
        layerSpacing: 48,
        columnSpacing: 24,
      }),
      model: $(go.GraphLinksModel, { linkKeyProperty: "key" }),
    });

    diagram.nodeTemplate = $(
      go.Node, "Auto",
      {
        shadowVisible: true,
        shadowBlur: 6,
        shadowOffset: new go.Point(0, 2),
        shadowColor: "rgba(0,0,0,0.12)",
      },
      $(
        go.Shape, "RoundedRectangle",
        { strokeWidth: 0, parameter1: 10 },
        new go.Binding("fill", "category", (cat) => CATEGORY_COLORS[cat] || "#6366f1")
      ),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(8, 14, 8, 14),
          editable: true,
          font: "500 12px Inter, sans-serif",
          stroke: "white",
          maxSize: new go.Size(150, NaN),
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
        },
        new go.Binding("text", "text").makeTwoWay()
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.AvoidsNodes, corner: 6 },
      $(go.Shape, { stroke: "#c7d2fe", strokeWidth: 1.5 }),
      $(go.Shape, { toArrow: "Standard", fill: "#a5b4fc", stroke: null, scale: 0.85 }),
      $(
        go.TextBlock,
        {
          segmentOffset: new go.Point(0, -11),
          font: "10px Inter, sans-serif",
          stroke: "#6b7280",
          background: "rgba(255,255,255,0.85)",
          margin: new go.Margin(1, 3),
        },
        new go.Binding("text", "text")
      )
    );

    return diagram;
  };

  return (
    <ReactDiagram
      initDiagram={initDiagram}
      divClassName="diagram-component"
      style={{ height }}
      nodeDataArray={nodeDataArray}
      linkDataArray={linkDataArray}
    />
  );
};

export default MindMap;
