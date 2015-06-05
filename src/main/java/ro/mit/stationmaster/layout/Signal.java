package ro.mit.stationmaster.layout;

/**
 * Created by tmatrescu on 11/5/2015.
 */
public class Signal {

    private int number;
    private int type; //0 -x, y -1
    private String color;

    public Signal() {
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
