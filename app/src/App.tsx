import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Top } from "@/components/pages/Top";
import { appURL } from "@/config/url";

function App() {
  return (
    // urlのbasePathを設定
    // github pagesで動かすためにはブランチ名がpathに含まれるため必要
    <BrowserRouter basename={appURL.base}>
      <Routes>
        {/* pathのURLにアクセスするとelementのコンポーネントを呼び出す */}
        <Route path={appURL.top} element={<Top />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
