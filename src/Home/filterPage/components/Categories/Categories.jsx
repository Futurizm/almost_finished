import React, {useEffect, useRef, useState} from 'react';
import cl from '../SelectBlock/SelectBlock.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import axios from 'axios';
import {useFetch} from '../../../../components/hooks/useFetchB.js';
import {useDispatch} from "react-redux";
import {setActiveCategory} from "../../../../actions.js";
import Places from "../Places/Places.jsx";
import MyLine from "../UI/MyLine/MyLine.jsx";
import MyBigButton from "../UI/MyBigButton/MyBigButton.jsx";
import {Link} from "react-router-dom";
import sun from "../../imgs/Header/sun.svg";

const Categories = ({activeCategory, onCategoryClick, handleFilterPageClose}) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [categoryTitles, setCategoryTitles] = useState({});
    const pathParts = location.pathname.split('/');
    const encodedCategory = pathParts[pathParts.length - 1];
    const initialCategoryId = categoryTitles[encodedCategory] || encodedCategory;
    const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
    const [data, setData] = useState({});
    const [fetching, isDataLoading, dataError] = useFetch(async () => {
        const response = await axios.get(
            'https://places-test-api.danya.tech/api/categories?populate=image,posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory'
        );
        setData(response.data || {});
        return response;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       setLoading(false);
    }, []);
    const [selectedCategory, setSelectedCategory] = useState(activeCategory);
    const [prevCategories, setPrevCategories] = useState([]);
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };
    const buttonRef = useRef(null);
    useEffect(() => {
        // Check if the button reference exists and if it does, simulate a click
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, [buttonRef]);

    useEffect(() => {
        fetching();
    }, []);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data.data && activeCategory) {
            const defaultActiveCategoryIndex = data.data.findIndex(
                (button) => button.id === activeCategory
            );

            if (defaultActiveCategoryIndex !== -1) {
                setSelectedButton(defaultActiveCategoryIndex);
                setActiveCategoryId(data?.data?.[defaultActiveCategoryIndex]?.id);
                if (onCategoryClick) {
                    // Use clickedCategoryId directly here
                    onCategoryClick({
                        category: data?.data?.[defaultActiveCategoryIndex],
                        categoryId: data?.data?.[defaultActiveCategoryIndex]?.id,
                    });
                }
            }
        }
    }, [data.data, activeCategory, onCategoryClick]);

    const [filterClosed, setFilterClosed] = useState(false);


    const handleCloseFilter = () => {
        setFilterClosed(true);
        // Additional logic if needed
    };
    const handleButtonClick = (index, categoryId) => {
        dispatch(setActiveCategory(categoryId));

        setSelectedButton(index);
        const clickedCategoryId = data?.data?.[index]?.id;
        setActiveCategoryId(clickedCategoryId);
        if (onCategoryClick) {
            onCategoryClick({
                category: data?.data?.[index],
                categoryId: clickedCategoryId,
            });
        }
    };


    return (
        <div>
            {loading &&
                <div className={cl.loadingSpinner}>
                    <img className={cl.loader} src={sun} alt="Loading"/>
                </div>
            }
                <div className={cl.button__select}>
                    <div className={cl.button__select__row}>
                        {data?.data?.map((button, index) => (
                            <MySelectedButton
                                key={index + 1}
                                isRed={selectedButton === index}
                                onClick={() => {
                                    handleButtonClick(index);
                                }}
                                ref={buttonRef}
                            >
                                <img
                                    className={cl.button__image}
                                    src={`https://places-test-api.danya.tech${button?.attributes?.image?.data?.attributes?.url}`}
                                    alt={`Изображение ${index}`}
                                />
                                {button?.attributes?.title}
                            </MySelectedButton>
                        ))}
                    </div>
                </div>
            <MyLine/>
            <Places activeCategory={activeCategoryId}/>
            <MyLine/>

            {isDataLoading ? (
                <div style={{height: "40px"}} className={cl.loadingSpinner}>
                    <img style={{width: 20}} className={cl.loader} src={sun} alt="Loading"/>
                </div>
            ) : (
                <div className={cl.cont}>
                    <MyBigButton onSelectCategory={handleCategorySelect} handleFilterPageClose={handleFilterPageClose}
                                 categoryId={activeCategoryId} onCloseFilter={handleCloseFilter}>Показать
                        результаты</MyBigButton>
                </div>
            )}
        </div>
    );
};

export default Categories;
