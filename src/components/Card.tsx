import { Link } from "react-router-dom";
import { CardProps } from "../utils/types";

const Card: React.FunctionComponent<CardProps> = ({ image = '', price = '2.3', productName = 'Apple', productId = '' }: CardProps) => {
    return (
        <div className="flex-col p-1 w-[150px] mx-auto  ">
            <Link to={`detail_page/${productId}`}>
                <div className="rounded-lg p-1 bg-white w-[100%] h-[150px] flex items-center justify-center ">
                    <img src={image}  alt={productName}  className="h-[120px] w-[120px] object-fill rounded-lg" />
                </div>
            </Link>
            <span className="text-left text-sm font-light mt-1 block">{productName}</span>
            <span className="text-center text-sm font-light block mt-1" >$ {price}</span>
        </div>
    )
}

export default Card