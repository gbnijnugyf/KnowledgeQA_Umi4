import { Card,Image } from "antd";
import "./CourseForm.scss"

export interface ICardArray {
  list: API.KnowledgeBaseListItem[];
  myOnClick: (course:API.KnowledgeBaseListItem) => void;
}

export function CardArrayItem(props: ICardArray) {
  return (
    <>
      <div className="carousel-content">
        <div className="carousel-content-text">
          {props.list.map((card) => {
            return (
              <Card
                hoverable
                className="carousel-content-item"
                cover={
                  // <div style={{ marginLeft:"5%",overflow: "hidden", height: "100%", textOverflow:"ellipsis" }}>
                    <h4 style={{marginLeft:"5%",width:"80%", overflow:"hidden",whiteSpace: 'nowrap', textOverflow:"ellipsis"}}>{card.name}</h4>
                  // </div>
                }
                onClick={() => {
                    props.myOnClick(card);
                }}
              >
                <p className="ant-card-text">
                  <div>授课教师：{card.owner}</div>
                  <p>简述：{card.desc}</p>
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
