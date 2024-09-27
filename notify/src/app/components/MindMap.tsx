import React, { useEffect, useRef } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import "../styles/MindMap.css"; // Import the specific CSS file for MindMap

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
}

const MindMap: React.FC<MindMapProps> = ({ nodeDataArray, linkDataArray }) => {
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (diagramRef.current) {
      diagramRef.current.model = new go.GraphLinksModel(
        nodeDataArray,
        linkDataArray
      );
    }
  }, [nodeDataArray, linkDataArray]);

  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, {
        direction: 90, // Layout direction (0: right, 90: down, 180: left, 270: up)
        layerSpacing: 50, // Spacing between layers
        columnSpacing: 30, // Spacing between columns
      }),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
      }),
    });

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      $(
        go.Shape,
        "RoundedRectangle",
        { strokeWidth: 2, stroke: "black" }, // Add border with strokeWidth and stroke color
        new go.Binding("fill", "category", (cat) => {
          switch (cat) {
            case "event":
              return "#FFCC00";
            case "location":
              return "#00CCFF";
            case "person":
              return "#FF99CC";
            case "group":
              return "#99CC00";
            default:
              return "#FFFFFF";
          }
        })
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding("text", "text").makeTwoWay()
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(
        go.TextBlock,
        { segmentOffset: new go.Point(0, -10) },
        new go.Binding("text", "text")
      )
    );

    return diagram;
  };

  return (
    <div className="mindmap-section">
      <h2>Mindmap</h2>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
      />
    </div>
  );
};

export default MindMap;
