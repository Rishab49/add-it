const { render,screen } = require("@testing-library/react");
const { describe } = require("node:test");
const Header = require("../app/game/components/Header");
const {Timer} = require("../app/app");
describe("Page", () => {
    it("render a heading", () => {
        
        let score = 0;
        let clock = new Timer(1,0);
        render(<Header.default score={score} clock={clock}/>)
        // const heading = screen.
        expect(heading).toBeInTheDocument();
    })
});