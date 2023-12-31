import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Generated by https://quicktype.io

export interface NewsData {
  sort: Sort[];
  value: Value[];
}

export interface QueryContext {
  _type: string;
  originalQuery: string;
  adultIntent: boolean;
}

export interface Sort {
  _type: string;
  name: string;
  id: string;
  isSelected: boolean;
  url: string;
}

export interface Value {
  _type: ValueType;
  name: string;
  url: string;
  image?: ValueImage;
  description: string;
  provider: Provider[];
  datePublished: string;
  about?: About[];
  mentions?: Mention[];
}

export enum ValueType {
  NewsArticle = "NewsArticle",
}

export interface About {
  _type: AboutType;
  readLink: string;
  name: string;
}

export enum AboutType {
  Thing = "Thing",
}

export interface ValueImage {
  _type: string;
  thumbnail: PurpleThumbnail;
}

export interface PurpleThumbnail {
  _type: string;
  contentUrl: string;
  width: number;
  height: number;
}

export interface Mention {
  _type: AboutType;
  name: string;
}

export interface Provider {
  _type: ProviderType;
  name: string;
  image?: ProviderImage;
}

export enum ProviderType {
  Organization = "Organization",
}

export interface ProviderImage {
  _type: string;
  thumbnail: FluffyThumbnail;
}

export interface FluffyThumbnail {
  _type: string;
  contentUrl: string;
}

interface StateType extends NewsData {
  isLoading: boolean;
  error: string | null | undefined;
}

const initialNewsState: StateType = {
  sort: [],
  value: [],
  isLoading: false,
  error: null,
};

export const getNewsData = createAsyncThunk(
  "content/getNews",
  async (data: { newsCategory: string; count: number }) => {
    const { newsCategory, count } = data;
    try {
      const response = await axios.get(
        import.meta.env.VITE_GET_NEWS_BASE_URL,
        {
          params: {
            q: newsCategory,
            freshness: "Day",
            textFormat: "Raw",
            safeSearch: "Off",
            count: count,
          },
          headers: {
            "X-BingApis-SDK": "true",
            "X-RapidAPI-Key": import.meta.env.VITE_API_KEY
            ,
            "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
          },
        }
      );
      const data = await response.data;
      console.log(data);
      return data;
    } catch (error) {
      return error;
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState: initialNewsState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getNewsData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNewsData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.value = action.payload.value;
      state.sort = action.payload.sort;
    });
    builder.addCase(getNewsData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default newsSlice.reducer;
