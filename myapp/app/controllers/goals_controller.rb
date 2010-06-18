class GoalsController < ApplicationController

  before_filter :load_goal, :only => [:show, :edit, :update, :destroy]
  before_filter :require_login, :only => [:new, :edit, :create, :update, :destroy]
  before_filter :require_admin, :only => [:edit, :update, :destroy]

  def load_goal
    @goal = Goal.find(params[:id])
  end

  def require_admin
    unless @current_user == @goal.admin
      flash[:error] = "You are not the admin of this goal."
      redirect_to request.referer
    end
  end

  # GET /goals
  def index
    @goals = Goal.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @goals }
    end
  end

  # GET /goals/1
  def show
    respond_to do |format|
      format.html # show.html.erb
    end
  end

  # GET /goals/new
  def new
    @goal = Goal.new

    respond_to do |format|
      format.html # new.html.erb
    end
  end

  # GET /goals/1/edit
  def edit
  end

  # POST /goals
  def create
    @goal = Goal.find_by_name(params[:goal][:name])
    if @goal
      @goal.users << @current_user
      respond_to do |format|
        format.html { redirect_to(goal_notes_path(@goal), :notice => 'Existing goal added to your list.') }
      end
    else
      @goal = Goal.new(params[:goal])
      @goal.admin = @current_user
      @goal.status = "active"

      respond_to do |format|
        if @goal.save
          @current_user.goals << @goal
          format.html { redirect_to(goal_notes_path(@goal), :notice => 'Goal was successfully created.') }
        else
          format.html { render :action => "new" }
        end
      end
    end
  end

  # PUT /goals/1
  def update
    respond_to do |format|
      if @goal.update_attributes(params[:goal])
        format.html { redirect_to(@goal, :notice => 'Goal was successfully updated.') }
      else
        format.html { render :action => "edit" }
      end
    end
  end

  # DELETE /goals/1
  def destroy
    @goal.destroy

    respond_to do |format|
      format.html { redirect_to(goals_url) }
    end
  end
end
