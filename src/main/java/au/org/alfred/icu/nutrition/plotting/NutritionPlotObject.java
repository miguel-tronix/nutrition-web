/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package au.org.alfred.icu.nutrition.plotting;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author miguel
 */
public class NutritionPlotObject {
    
    
    private double targetEnergy;
    private double targetProtient;
    
    private double deliveredEnergy;
    private double deliveredProtein;
    
    private double targetEnergyEN;
    private double targetEnergyPN;
    private double targetEnergyON;
    
    
    private double deliveredEnergyEN;
    private double deliveredEnergyPN;
    private double deliveredEnergyON;
    private double deliveredEnergyPropofol;
    
    private double targetProteinEN;
    private double targetProteinPN;
    private double targetProteinON;
    
    
    private double deliveredProteinEN;
    private double deliveredProteinPN;
    private double deliveredProteinON;
    
    private int bowelMovements;
    
    private int gastricAspirate;
    
    private Date deliveredDate;
    
    private Date targetsDate;
    
    
    public NutritionPlotObject(){
    
        this.targetEnergy = 0.0;
        this.targetProtient = 0.0;
        this.deliveredEnergy = 0.0;
        this.deliveredProtein = 0.0;
        this.deliveredDate = null;
        this.deliveredEnergyEN = 0.0;
        this.deliveredEnergyPN = 0.0;
        this.deliveredEnergyON = 0.0;
        this.deliveredEnergyPropofol = 0.0;
        this.deliveredProteinEN = 0.0;
        this.deliveredProteinON = 0.0;
        this.deliveredProteinPN = 0.0;
        this.targetEnergyEN = 0.0;
        this.targetEnergyON = 0.0;
        this.targetEnergyPN = 0.0;
        this.targetProteinEN = 0.0;
        this.targetProteinON = 0.0;
        this.targetProteinPN = 0.0;
        this.bowelMovements = 0;
        this.gastricAspirate = 0;
        
    }

    /**
     * @return the targetEnergy
     */
    public double getTargetEnergy() {
        return targetEnergy;
    }

    /**
     * @param targetEnergy the targetEnergy to set
     */
    public void setTargetEnergy(double targetEnergy) {
        this.targetEnergy = targetEnergy;
    }

    /**
     * @return the targetProtient
     */
    public double getTargetProtient() {
        return targetProtient;
    }

    /**
     * @param targetProtient the targetProtient to set
     */
    public void setTargetProtient(double targetProtient) {
        this.targetProtient = targetProtient;
    }

    /**
     * @return the deliveredEnergy
     */
    public double getDeliveredEnergy() {
        return deliveredEnergy;
    }

    /**
     * @param deliveredEnergy the deliveredEnergy to set
     */
    public void setDeliveredEnergy(double deliveredEnergy) {
        this.deliveredEnergy = deliveredEnergy;
    }

    /**
     * @return the deliveredProtein
     */
    public double getDeliveredProtein() {
        return deliveredProtein;
    }

    /**
     * @param deliveredProtein the deliveredProtein to set
     */
    public void setDeliveredProtein(double deliveredProtein) {
        this.deliveredProtein = deliveredProtein;
    }

    /**
     * @return the deliveredDate
     */
    public Date getDeliveredDate() {
        return deliveredDate;
    }

    /**
     * @param deliveredDate the deliveredDate to set
     */
    public void setDeliveredDate(Date deliveredDate) {
        this.deliveredDate = deliveredDate;
    }
    
    @Override
    public String toString()
    {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        StringBuilder bldStr = new StringBuilder();
        bldStr.append("<plot>");
        bldStr.append("<targetProtein>").append(String.valueOf(this.targetProtient)).append("</targetProtein>");
        bldStr.append("<targetEnergy>").append(String.valueOf(this.targetEnergy)).append("</targetEnergy>");
        bldStr.append("<deliveredProtein>").append(String.valueOf(this.deliveredProtein)).append("</deliveredProtein>");
        bldStr.append("<deliveredEnergy>").append(String.valueOf(this.deliveredEnergy)).append("</deliveredEnergy>");
        bldStr.append("<deliveredEnergyEN>").append(String.valueOf(this.deliveredEnergyEN)).append("</deliveredEnergyEN>");
        bldStr.append("<deliveredEnergyPN>").append(String.valueOf(this.deliveredEnergyPN)).append("</deliveredEnergyPN>");
        bldStr.append("<deliveredEnergyON>").append(String.valueOf(this.deliveredEnergyON)).append("</deliveredEnergyON>");
        bldStr.append("<deliveredEnergyPropofol>").append(String.valueOf(this.deliveredEnergyPropofol)).append("</deliveredEnergyPropofol>");
        bldStr.append("<deliveredProteinEN>").append(String.valueOf(this.deliveredProteinEN)).append("</deliveredProteinEN>");
        bldStr.append("<deliveredProteinPN>").append(String.valueOf(this.deliveredProteinPN)).append("</deliveredProteinPN>");
        bldStr.append("<deliveredProteinON>").append(String.valueOf(this.deliveredProteinON)).append("</deliveredProteinON>");
        bldStr.append("<targetEnergyEN>").append(String.valueOf(this.targetEnergyEN)).append("</targetEnergyEN>");
        bldStr.append("<targetEnergyPN>").append(String.valueOf(this.targetEnergyPN)).append("</targetEnergyPN>");
        bldStr.append("<targetEnergyON>").append(String.valueOf(this.targetEnergyON)).append("</targetEnergyON>");
        bldStr.append("<targetProteinEN>").append(String.valueOf(this.targetProteinEN)).append("</targetProteinEN>");
        bldStr.append("<targetProteinPN>").append(String.valueOf(this.targetProteinPN)).append("</targetProteinPN>");
        bldStr.append("<targetProteinON>").append(String.valueOf(this.targetProteinON)).append("</targetProteinON>");
        bldStr.append("<bowelMovements>").append(String.valueOf(this.bowelMovements)).append("</bowelMovements>");
        bldStr.append("<gastricAspirate>").append(String.valueOf(this.gastricAspirate)).append("</gastricAspirate>");
        bldStr.append("<targetsDate>").append(df.format(this.targetsDate)).append("</targetsDate>");
        bldStr.append("<deliveredDate>").append(df.format(this.deliveredDate)).append("</deliveredDate>");
        bldStr.append("</plot>");
        
        return bldStr.toString();
    }

    /**
     * @return the targetEnergyEN
     */
    public double getTargetEnergyEN() {
        return targetEnergyEN;
    }

    /**
     * @param targetEnergyEN the targetEnergyEN to set
     */
    public void setTargetEnergyEN(double targetEnergyEN) {
        this.targetEnergyEN = targetEnergyEN;
    }

    /**
     * @return the targetEnergyPN
     */
    public double getTargetEnergyPN() {
        return targetEnergyPN;
    }

    /**
     * @param targetEnergyPN the targetEnergyPN to set
     */
    public void setTargetEnergyPN(double targetEnergyPN) {
        this.targetEnergyPN = targetEnergyPN;
    }

    /**
     * @return the targetEnergyON
     */
    public double getTargetEnergyON() {
        return targetEnergyON;
    }

    /**
     * @param targetEnergyON the targetEnergyON to set
     */
    public void setTargetEnergyON(double targetEnergyON) {
        this.targetEnergyON = targetEnergyON;
    }

    /**
     * @return the deliveredEnergyEN
     */
    public double getDeliveredEnergyEN() {
        return deliveredEnergyEN;
    }

    /**
     * @param deliveredEnergyEN the deliveredEnergyEN to set
     */
    public void setDeliveredEnergyEN(double deliveredEnergyEN) {
        this.deliveredEnergyEN = deliveredEnergyEN;
    }

    /**
     * @return the deliveredEnergyPN
     */
    public double getDeliveredEnergyPN() {
        return deliveredEnergyPN;
    }

    /**
     * @param deliveredEnergyPN the deliveredEnergyPN to set
     */
    public void setDeliveredEnergyPN(double deliveredEnergyPN) {
        this.deliveredEnergyPN = deliveredEnergyPN;
    }

    /**
     * @return the deliveredEnergyON
     */
    public double getDeliveredEnergyON() {
        return deliveredEnergyON;
    }

    /**
     * @param deliveredEnergyON the deliveredEnergyON to set
     */
    public void setDeliveredEnergyON(double deliveredEnergyON) {
        this.deliveredEnergyON = deliveredEnergyON;
    }

    /**
     * @return the targetProteinEN
     */
    public double getTargetProteinEN() {
        return targetProteinEN;
    }

    /**
     * @param targetProteinEN the targetProteinEN to set
     */
    public void setTargetProteinEN(double targetProteinEN) {
        this.targetProteinEN = targetProteinEN;
    }

    /**
     * @return the targetProteinPN
     */
    public double getTargetProteinPN() {
        return targetProteinPN;
    }

    /**
     * @param targetProteinPN the targetProteinPN to set
     */
    public void setTargetProteinPN(double targetProteinPN) {
        this.targetProteinPN = targetProteinPN;
    }

    /**
     * @return the targetProteinON
     */
    public double getTargetProteinON() {
        return targetProteinON;
    }

    /**
     * @param targetProteinON the targetProteinON to set
     */
    public void setTargetProteinON(double targetProteinON) {
        this.targetProteinON = targetProteinON;
    }

    /**
     * @return the deliveredProteinEN
     */
    public double getDeliveredProteinEN() {
        return deliveredProteinEN;
    }

    /**
     * @param deliveredProteinEN the deliveredProteinEN to set
     */
    public void setDeliveredProteinEN(double deliveredProteinEN) {
        this.deliveredProteinEN = deliveredProteinEN;
    }

    /**
     * @return the deliveredProteinPN
     */
    public double getDeliveredProteinPN() {
        return deliveredProteinPN;
    }

    /**
     * @param deliveredProteinPN the deliveredProteinPN to set
     */
    public void setDeliveredProteinPN(double deliveredProteinPN) {
        this.deliveredProteinPN = deliveredProteinPN;
    }

    /**
     * @return the deliveredProteinON
     */
    public double getDeliveredProteinON() {
        return deliveredProteinON;
    }

    /**
     * @param deliveredProteinON the deliveredProteinON to set
     */
    public void setDeliveredProteinON(double deliveredProteinON) {
        this.deliveredProteinON = deliveredProteinON;
    }

    /**
     * @return the bowelMovements
     */
    public int getBowelMovements() {
        return bowelMovements;
    }

    /**
     * @param bowelMovements the bowelMovements to set
     */
    public void setBowelMovements(int bowelMovements) {
        this.bowelMovements = bowelMovements;
    }

    /**
     * @return the gastricAspirate
     */
    public int getGastricAspirate() {
        return gastricAspirate;
    }

    /**
     * @param gastricAspirate the gastricAspirate to set
     */
    public void setGastricAspirate(int gastricAspirate) {
        this.gastricAspirate = gastricAspirate;
    }

    /**
     * @return the targetsDate
     */
    public Date getTargetsDate() {
        return targetsDate;
    }

    /**
     * @param targetsDate the targetsDate to set
     */
    public void setTargetsDate(Date targetsDate) {
        this.targetsDate = targetsDate;
    }

    /**
     * @return the deliveredEnergyPropofol
     */
    public double getDeliveredEnergyPropofol() {
        return deliveredEnergyPropofol;
    }

    /**
     * @param deliveredEnergyPropofol the deliveredEnergyPropofol to set
     */
    public void setDeliveredEnergyPropofol(double deliveredEnergyPropofol) {
        this.deliveredEnergyPropofol = deliveredEnergyPropofol;
    }
    
    
}
