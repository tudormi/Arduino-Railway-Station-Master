package ro.mit.stationmaster.layout;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.TrackDTO;
import java.util.ArrayList;

/**
 * Created by Tudormi on 15/5/2015.
 */
public class LayoutObserver {

    private final static Logger logger = LogManager.getLogger(LayoutObserver.class);

    @Autowired
    ArduinoMessageDispatcher arduinoMessageDispatcher;

    private ArrayList<Track> tracks;
    private ArrayList<Turnout> turnouts;

    LayoutObserver() {
        /* initially all the lines are empty with 0 speed */
        /* 0 - linie intrare, 5 - linie iesire */
        tracks = new ArrayList<Track>();
        for (int i = 0; i < 6; i++) {
            tracks.add(new Track(i+1, 0, "forward", "empty"));
        }
        /* initially all the turnouts are on the straight way */
        turnouts = new ArrayList<Turnout>();
        for (int i = 0; i < 6; i++) {
            turnouts.add(new Turnout(i+1, 0));
        }
    }

    /* singurul update venit de la Arduino momentan */
    public void updateLayoutFromArduino(IRSensor sensor) {
        /* daca linia este ocupata si macazele nu au fost facute pentru parasirea liniei
         * atunci cand unul din senzori este activat trenul sa se mai poate misca in
          * directia care se misca in acel moment*/

        int lineNumber = sensor.getLineNumber();
        if(!tracks.get(lineNumber).getState().equals(sensor.getState())){
            /* daca s-a schimbat starea unei linii facem update pe interfata si pe server*/
            /* update la long poll */
            tracks.get(lineNumber).setState(sensor.getState());
        }
    }

    public void updateLayout(TrackDTO trackDTO){
        /*se apeleaza aceasta metoda dupa validarea comenzii*/
//        System.out.println("am ajuns in update");
//        System.out.println(trackDTO.getDirection());
//        System.out.println(trackDTO.getNumber());
//        System.out.println(trackDTO.getSpeed());
        int lineNumber = trackDTO.getNumber();
        logger.info("Linia: " + lineNumber + " , viteza: " + trackDTO.getSpeed());
        tracks.get(lineNumber).setSpeed(trackDTO.getSpeed());
        tracks.get(lineNumber).setDirection(trackDTO.getDirection());
    }

    public void updateLayout(Turnout turnout){
        System.out.println("Turnout " + turnout.getNumber() + " changed to ["+ turnout.getDirection() +"]");
    }

    public int checkCommandValidity(TrackDTO trackDTO) {
        /* check if the you can move a train on the specific line */
        /**
         * daca linia este ocupata putem misca trenul doar pe linia respectiva pana la senzorii IR
         * daca trecem de un senzor IR nu mai putem misca trenul spre semnalul cel mai apropiat ci
         * doar in directia inversa
         * daca e ok se trimite comanda la arduino
         * apoi se face update la layout
         *
         *
         */
        if(trackDTO.getSpeed()>254){
            return 0;
        }
        else{
            int lineNumber = trackDTO.getNumber();
            if(tracks.get(lineNumber).getSpeed() > trackDTO.getSpeed() && (tracks.get(lineNumber).getSpeed()-trackDTO.getSpeed())>10){
                //ar trebui sa trimita mesaj mai rar cu o crestere treptata a vitezei
            }
            arduinoMessageDispatcher.sendTrackMessage(trackDTO);
        }
        updateLayout(trackDTO);

        return 1;
    }

    public int checkCommandValidity(Turnout turnout){

        switch(turnout.getNumber()){
            case 1:
                if(turnout.getDirection() == 1 && tracks.get(2).getState().equals("present") && tracks.get(0).getState().equals("present")){
                    /* linia 2 este ocupata si intrarea, macazele nu se pot schimba */
                    return 0;
                } else{
                    /* one of the line is not occupied and the turnouts are ok to change */
                    updateLayout(turnout);
                    turnout.setNumber(5);
                    updateLayout(turnout);
                }
                break;

            case 5:
                if(turnout.getDirection() == 1 && tracks.get(2).getState().equals("present") && tracks.get(0).getState().equals("present")){
                    /* linia 2 este ocupata si intrarea, macazele nu se pot schimba */
                    return 0;
                } else{
                    /* one of the line is not occupied and the turnouts are ok to change */
                    updateLayout(turnout);
                    turnout.setNumber(1);
                    updateLayout(turnout);
                }
                break;
        }

        return 1;
    }

    public int checkCommandValidity(Signal signal){
        /**
         * nu se poate pune un semnal pe liber daca linia este deja ocupata
         */

        return 1;
    }

    public Track getTrack(int trackNumber){
        return tracks.get(trackNumber);
    }

    public Turnout getTurnout(int turnoutNumber){
        return turnouts.get(turnoutNumber);
    }
}
